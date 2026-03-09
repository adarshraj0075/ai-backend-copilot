require("dotenv").config();
const express=require("express");
const groq=require("./llm/client");
const redis=require("./memory/redisClient");
const morgan=require("morgan");
const ratelimiter=require("express-rate-limit");

//explain me this in detail how this is working internally 
const limiter=ratelimiter({
    windowMs:1*60*1000,
    max:20,
    message:"too many req, plese try again later"
})

const app=express();
app.use(limiter);
app.use(express.json());
//what does this morgan do and what is dev inside it 
app.use(morgan("dev"));

app.get("/health",(req,res)=>{
    res.json({
        status:"ok",
        service:"ai-copilot",
        timeStamp:new Date()
    })
})


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

        const response=await groq.chat.completions.create({
            model:"llama-3.1-8b-instant",
            //why are we sending full message array why not only question how will this 
            // groq model will know what is the actual question if we send the whole msg array 
            messages,
        })

        // what is thsi response.choises[0].message.content;
        const answer=response.choices[0].message.content;

        messages.push({role:"assistant",content:answer});

        await redis.set(userId,JSON.stringify(messages),"EX",3600);
        res.json({answer});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"something went wrong"})
    }
})

app.listen(3000,()=>{
    console.log("server running....");
})

//what is this global error handler how is this working 
//and how is this important

app.use((err,req,res,next)=>{
    console.error(err),
    res.staus(500).json({
        err:"intenal server error"
    })
})