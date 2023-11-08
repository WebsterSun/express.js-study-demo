const express = require("express")
const router = express.Router()

router.get('/api/goods/list',(req,res,next)=>{
  res.end('mygoods.list.get')
})
router.post('/api/goods/detail',(req,res,next)=>{
  res.end("details . post")
  
})
module.exports = router