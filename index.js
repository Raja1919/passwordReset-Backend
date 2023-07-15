require("dotenv").config()
const express =require('express')
const mongoose=require('mongoose');
const routes=require("./Routes/routes");
const cors=require("cors")


const PORT=process.env.PORT

const app=express();

app.use(express.json());

app.use(cors())

app.use('/api',routes)



// connect to mongodb
const url=process.env.MONGO_URL

mongoose.set("strictQuery",false);

mongoose.connect(url)
.then(result=>{console.log("connected to mongodb")})
.catch((error)=>{
    console.log(error)
}) 




app.listen(PORT,()=>console.log(`server started localHost:${PORT}`))