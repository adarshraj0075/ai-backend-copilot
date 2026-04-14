const groq=require("../config/groq");
async function getEmbedding(text){
    const response=await groq.chat.completions.create({
        model:"llama-3.1-8b-instant",
        messages:[
            {
                role:"system",
                content:"Convert this text into a concise semantic representation."
            },
            {
                role:"user",
                content:text
            }
        ]
    })
    
    const content=response.choices[0].message.content;

    //converting string response to number
    return content.split("").map(c=>c.charCodeAt(0)/255);
}

module.exports={fakeEmbedding};