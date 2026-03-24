const express=require("express");
const router=express.Router();
const {askRepo}=require("../controllers/github.contoller");

router.post("/ask-repo",askRepo);

module.exports=router