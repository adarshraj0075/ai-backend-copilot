function fakeEmbedding(text){
    return text.split("").map(char=>char.charCodeAt(0)/255);
}

module.exports={fakeEmbedding};