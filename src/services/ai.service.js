const groq=require("../config/groq");
const {executeTool}=require("../tools/toolExecutor")

async function getAiResponse(messages){
    const lastMessage=messages[messages.length-1].content;

    //simple tool detection
    if(lastMessage.toLowerCase().includes("server status")){
        const toolResult = await executeTool("getServerStatus");

        messages.push({
            role:"system",
            content:`Tool Result ${JSON.stringify(toolResult)}`
        })
    }

    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages,
    });

    return completion.choices[0].message.content;
}

module.exports={getAiResponse};