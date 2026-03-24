const {getAiResponse}=require("./ai.service");
const {getRepofiles,getFileContent}=require('./github.service');

async function answerFromRepo(owner,repo,question) {
    const files=await getRepofiles(owner,repo);

    let context="";

    // why are we running for of loop on files 
    for(let file of files){
        if(file.type==="file"){
            //what is this content and what is file.download_url doing 
            const content=await getFileContent(file.download_url);
            //why is this \n and why are we using 
            context+=`\n\nile: ${file.name}\n${content}`
        }
    }

    const message=[
        // why hear is two role and two content 
        {
            role:"system",
            content:"you are an ai that explains github repositories."
        },
        {
            role:"user",
            content:`hear is the repo code:\n${context}\n\nQuestion:${question}`
        }
    ];

    return getAiResponse(message)
}

module.exports={answerFromRepo};