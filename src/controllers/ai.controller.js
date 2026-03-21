const {getAiResponse}=require("../services/ai.service");
const {getMessages,saveMessages} =require("../services/memory.service");

async function askAi(req,res,next){
    try {
        const {userId,question}=req.body;
        const messages=getMessages(userId);
        messages.push({role:"user",content:question});
        const answer=getAiResponse(messages);
        messages.push({role:"assistent",constent:answer})
        await saveMessages(userId,messages)
        res.json(answer);
    } catch (error) {
        next(error)
    }
}

module.exports={askAi};