const redis = require("../config/redis");

async function getMessages(userId) {
    const history=await redis.get(userId);
    return history?JSON.parse(history):[];
}

async function saveMessages(userId,messages){
    await redis.set(userId,JSON.stringify(messages),"EX",3600);
}

module.exports={getMessages,saveMessages};