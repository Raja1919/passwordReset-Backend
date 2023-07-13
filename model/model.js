const mongoose=require('mongoose')


// create a schema
const Schema=new mongoose.Schema({
    Name:{
        type:String,
    },
    Email:{
        type:String,
        unique:true
    },
    Password:{
        type:String
    },
    
})

// create a model
const model=mongoose.model("PasswordReset",Schema,"users");


 module.exports=model