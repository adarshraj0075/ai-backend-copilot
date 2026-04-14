const {getAiResponse}=require("./ai.service");
const {getRepofiles,getFileContent}=require('./github.service');
const {fakeEmbedding}=require("./embedding.service");
const {searchVectorStore,addToVectorStore,isRepoIndexed,markRepoIndexed}=require('./vector.service');

async function indexRepo(owner,repo) {
    const repoKey=`${owner}/${repo}`
    if(isRepoIndexed(repoKey)) return;
    const files=await getRepofiles(owner,repo);
    console.log("getting inside file loop")
    for(let file of files){
        if(file.type==="file"){
            const content=await getFileContent(file.download_url);
            console.log(`this is content ${content}`);

            //explain me .match method in detail what it is doing and how ?
            const chunks=content.match(/.{1,200}/g) || [];
            //console.log("getting inside the loop");
            for(let chunk of chunks){
                //console.log("inside the loop")
                //console.log(chunk)
                const embedding=fakeEmbedding(chunk);
                addToVectorStore(chunk,embedding,repoKey);
            }
        }
    }
    markRepoIndexed(repoKey);
}

//explain me the whole answerFromRepo in detail
async function answerFromRepo(owner,repo,question) {
    
    // hear indexRepo is not returning any thing what is the use of the indexRepo as this repo is not also exported anywhere
    // i can see that indexRepo is used for chunking and 
    await indexRepo(owner,repo);
    //hear we are embedding the question so that we can math that embedding from vector store to get answer ?
    const queryEmbedding=fakeEmbedding(question);
    // if i am getting resutl by only searching the vector store then why me need ai and i get my answer in result then what is this 
    //context for 
    const result=searchVectorStore(queryEmbedding,`${owner}/${repo}`)
    let context="";
    for(let r of result){
        if(context.length+r.text.length>2000) break;
        context+=r.text+ "\n";
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

    // what is this ai Response even doing when i get the result from the searchVector store by matching embedding of question with 
    // the github repo embbeding what is the use of get Ai response ?
    return getAiResponse(message)
}

module.exports={answerFromRepo};