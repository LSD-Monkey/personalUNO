const http=require('http');
const port=Number(process.env.PORT||3000);
const req=http.get({host:process.env.HOST||'127.0.0.1',port,path:'/health'},res=>{let d='';res.on('data',x=>d+=x);res.on('end',()=>{if(res.statusCode!==200||!JSON.parse(d).ok)process.exit(1);console.log('smoke ok');});});
req.on('error',()=>process.exit(1));
