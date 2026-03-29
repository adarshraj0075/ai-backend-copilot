const similarity = require("cosine-similarity");
let vectorStore=[];

function addToVectorStore(text,embedding){
    vectorStore.push({text,embedding});
}

function searchVectorStore(queryEmbedding,topK=1){
    return vectorStore.map(item=>({
        ...item,
        score:similarity(queryEmbedding,item.embedding),//what does similatity will return is it boolean value or what ?
    }))
    .sort((a,b)=>b.score-a.score)
    .slice(0,topK);
}

module.exports={addToVectorStore,searchVectorStore}