const {answerFromRepo}=require("../services/rag.service")

async function askRepo(req,res,next) {
  try{ 
        const {owner,repo,question}=req.body;
        const answer=await answerFromRepo(owner,repo,question);
        res.json({
            answer
        })   
    }catch(err){
        next(err)
    }
}

module.exports={askRepo}