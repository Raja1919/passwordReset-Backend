const jwt=require ("jsonwebtoken")

const generateToken=(id)=>jwt.sign(
    {id},
    process.env.SECRET_KEY,
    {expiresIn:"20d"}

)
module.exports=generateToken