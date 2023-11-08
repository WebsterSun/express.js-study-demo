const express = require("express")
const path = require("path")
const userRouter = require("./router/user")
const cookieParser = require("cookie-parser")

const app = express()


//处理静态资源
app.use(express.static(path.join(__dirname,'public')))

//处理动态资源和网页
//1.告诉express动态资源在什么地方
app.set('views',path.join(__dirname,'views'))
//2.告诉express动态网页使用的模板引擎
// app.set('view engine','ejs')
//3.监听请求，返回渲染后的动态网页

// app.get('/',(req,res,next)=>{
//   //注意点：express给请求对象和响应对象添加了很多自定义的方法

//   res.render('index',{msg:'asdasdasdeasdasd'})
// })

//express处理路由
//方式1：
app.get('/api/user/login',(req,res,next)=>{
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

app.post('/api/user/register',(req,res,next)=>{
  res.json({
    code:200,
    msg:'注册成功',
    name:"zhangsan",
    method:'post'
  })
})

//方式2：
app.use('/api/user',userRouter)

app.get('/get',(req,res,next)=>{
//express会将get请求参数转换成对象后，放到请求对象的query属性中

})
app.use(express.json()) //告诉express能够解析application/json类型的请求参数

//告诉express能够解析表单类型的请求参数 extend:false 表示使用node自带的queryString来解析 反之用第三方工具解析
app.use(express.urlencoded({extended:false}))

//express会将解析之后，转换成对象的post请求参数放到请求对象的body属性中
app.post('/post',(req,res,next)=>{
  console.log(req.body)
})

//express使用请求对象req中的cookie时要借助第三方插件，不然就是undefined
app.use(cookieParser())
//处理cookie
app.get('/setCookie',(req,res,next)=>{
  res.cookie('username','zhangsan',{httpOnly:true,path:'/',maxAge:10000})
  res.end()
})

app.get('/getCookie',(req,res,next)=>{
  console.log(req.cookies)
})




//express 的next方法
/*
1.use既可以处理没有路由地址的请求，也可以处理有路由地址的请求
2.use既可以处理get请求也可以处理post请求
3.在处理请求的时候，时从上到下的，哪一个先满足就哪一个处理
4.如果在处理请求的回调函数中没有调用next方法，那么处理完之后就不会继续往下判断了
5.如果在处理请求的回调函数中调用了next方法，那么处理完成后还会继续往下判断
**/ 
app.use((req,res,next)=>{
  console.log("use1 没有路由地址")
  next();
})
app.use('/',(req,res,next)=>{
  console.log("use2 有路由地址")
  next();
})
app.get('/api',(req,res,next)=>{
  console.log("get1 /api ")
  next();
})
app.get('/api/user',(req,res,next)=>{
  console.log("get2 /api/user ")
  next();
})
app.post('/api',(req,res,next)=>{
  console.log("post1 /api ")
  next();
})
app.post('/api/user',(req,res,next)=>{
  console.log("post2 /api/user ")
  next();
})

/*
默认情况下会c从上至下的匹配路由处理方法，一旦匹配到了就会立即执行
执行完后没有调用next就停止
执行完后如果调用了next就继续向下匹配
**/

//next方法的正确打开方式
/**
 * 通过next方法可以将同一个请求的多个业务逻辑拆分到不同方法中处理
 * 这样可以提升代码的可读性和可维护性，保证代码的单一性原则
 */
app.get('/api/user/info',(req,res,next)=>{
  console.log('验证用户是否登录')
  next()
},()=>{
  console.log('用户已经登录，可以查看信息')
})


//错误处理
//将没有地址的use方法放在最后
app.use((err,req,res,next)=>{
  console.log(err)
})

//中间件
/**
 * 本质就是一个函数，接收3个参数，req,res,next
 * 当请求进来，会从第一个中间件进行匹配，如果匹配则进入，不匹配则向后继续对比匹配
 * 
 * 作用： 将一个请求的处理过程分发到多个环节中，目的效率高，便于维护，即保证每个环节只做一件事
 * 例如这两个函数都是中间件 app.get('/api/user/info',(req,res,next)=>{
      console.log('验证用户是否登录')
      next()
    },()=>{
      console.log('用户已经登录，可以查看信息')
    })

    中间件的分类： 1.应用级别(app)的中间件 例如：app.get/app.post
                  2.路由级别（router）的中间件 router.get/router.post
                  3.错误处理中间件，与其他函数基本相同，但多一个err变量
                  4.内置中间件，例如：express.json(), express.static()
                  5.第三方中间件 cookie-parser
 */


app.listen(3000,()=>{
  console.log('listen ok!')
})