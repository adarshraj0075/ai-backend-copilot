const OpenAi=require("openai");

const openai=OpenAi({
    apikey:process.env.OPENAI_API_KEY,
})

module.exports=openai;