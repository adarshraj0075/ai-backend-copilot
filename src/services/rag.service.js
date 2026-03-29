const {getAiResponse}=require("./ai.service");
const {getRepofiles,getFileContent}=require('./github.service');
const {fakeEmbedding}=require("./embedding.service");
const {searchVectorStore,addToVectorStore}=require('./vector.service');

async function indexRepo(owner,repo) {
    const files=await getRepofiles(owner,repo);
    for(let file of files){
        if(file.type==="file"){
            const content=await getFileContent(file.download_url);

            const chunks=content.match(/.{1,500}/g) || [];

            for(let chunk of chunks){
                const embedding=fakeEmbedding(chunk);
                addToVectorStore(chunk,embedding);
            }
        }
    }
}

async function answerFromRepo(owner,repo,question) {
    
    await indexRepo(owner,repo);
    const queryEmbedding=fakeEmbedding(question);
    const result=searchVectorStore(queryEmbedding)
    const context=result.map(r=>r.text).join("\n");

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