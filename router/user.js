const express = require("express")
const router = express.Router()

//会将注册的地址和当前的地址拼接在一起来匹配

router.get('/login',(req,res,next)=>{
  // 注意：响应对象json方法是express给响应对象添加的
  //这个方法会自动将对象转换成字符串后返回
  //还会帮我们自动设置响应头
  res.json({
    code:200,
    msg:'登录成功',
    name:"zhangsan",
    method:'get'
  })
})

router.post('/register',(req,res,next)=>{
  res.json({
    code:200,
    msg:'注册成功',
    name:"zhangsan",
    method:'post'
  })
})

module.exports = router