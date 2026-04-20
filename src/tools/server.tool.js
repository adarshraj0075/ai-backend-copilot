function getServerStatus(){
    return {
        status:"running",
        uptime:process.uptime(),
    }
}

function getCurrentTime(){
    return{
        time:new Date().toISOString(),
    }
}

module.exports={
    getServerStatus,
    getCurrentTime,
}