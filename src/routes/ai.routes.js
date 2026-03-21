const express=require("express");
const router=express.Router();

const {askAi}=require("../controllers/ai.controller");

router.post("/ask",askAi);

router.get("/health",(req,res)=>{
    res.json({status:"ok"});
});

module.exports=router