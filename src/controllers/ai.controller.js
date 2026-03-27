const {getAiResponse}=require("../services/ai.service");
const {getMessages,saveMessages} =require("../services/memory.service");

async function askAi(req,res,next){
    try {
        const {userId,question}=req.body;
        const messages=await getMessages(userId);
        messages.push({role:"user",content:question});
        const answer=await getAiResponse(messages);
        messages.push({role:"assistant",content:answer})
        await saveMessages(userId,messages)
        res.json(answer);
    } catch (error) {
        next(error)
    }
}

module.exports={askAi};