require("dotenv").config()
const express =require('express')
const mongoose=require('mongoose');
const routes=require("./Routes/routes");
const cors=require("cors")


const port=process.env.port

const app=express();

app.use(express.json());

app.use(cors())

app.use('/',routes)



// connect to mongodb
const url=process.env.mongo_url

mongoose.set("strictQuery",false);

mongoose.connect(url)
.then(result=>{console.log("connected to mongodb")})
.catch((error)=>{
    console.log(error)
}) 




app.listen(port,()=>console.log(`server started localHost:${port}`))