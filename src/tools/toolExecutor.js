const {getServerStatus,getCurrentTime}=require("./server.tool");

async function executeTool(toolname){
    if(toolname==="getServerStatus"){
        return getServerStatus();
    }else if(toolname==="getCurrentTime"){
        return getCurrentTime();
    }
    else{
        return "unknown tool";
    }
}

module.exports={executeTool}