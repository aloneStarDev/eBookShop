const express = require("express");
const router = express.Router();

router.get("/add",(req,res)=>{
    res.end("hello");    
});

module.exports = router;