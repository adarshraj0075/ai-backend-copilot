const similarity = require("cosine-similarity");
let vectorStore=[];
let indexedRepo=new Set();
// why are we sending both text and embedding both?
function addToVectorStore(text,embedding){
    vectorStore.push({text,embedding});
}

//explain me the whole searchVectorStore function in detail 
function searchVectorStore(queryEmbedding,topK=2){
    return vectorStore.map(item=>({
        //why are we copying item object and returning it 
        ...item,
        //what is the similarity does 
        score:similarity(queryEmbedding,item.embedding),//what does similatity will return is it boolean value or what ?
    }))
    .sort((a,b)=>b.score-a.score)
    .slice(0,topK);
}

function isRepoIndexed(repoKey){
    return indexedRepo.has(repoKey)
}

function markRepoIndexed(repoKey){
    indexedRepo.add(repoKey)
}

module.exports={addToVectorStore,searchVectorStore,isRepoIndexed,markRepoIndexed}