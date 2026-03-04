require("dotenv").config();
const express=require("express");
const openai=require("./llm/client");
const redis=require("./memory/redisClient");

const app=express();
app.use(express.json());

app.post("/ask",async (req,res)=>{
    const {userId,question}=req.body || {};
    console.log(req.body);
    if(!userId || !question){
        return res.status(400).json('USERid and question required')
    }
    
    try {
        //what does this return ? why i am asking this question because we are storing
        //history in messages var and then we pushing a object inside the messages so what does redis.get return
        //does this return a array of object or simeple array ?
        const history=await redis.get(userId);
        const messages=history?JSON.parse(history):[]; //what does json.parse do ?
        messages.push({role:"user",content:question});

        const response=await openai.chat.completions.create({
            model:"gpt-4o-mini",
            //why are we sending full message array why not only question how will this 
            // openai model will know what is the actual question if we send the whole msg array 
            messages,
        })

        // what is thsi response.choises[0].message.content;
        const answer=response.choices[0].message.content;

        messages.push({role:"assistant",content:answer});

        await redis.set(userId,JSON.stringify(messages));
        res.json({answer});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"something went wrong"})
    }
})

app.listen(3000,()=>{
    console.log("server running....");
})