const jwt=require ("jsonwebtoken")

const generateToken=(id)=>jwt.sign(
    {id},
    process.env.secert_key,
    {expiresIn:"20d"}

)
module.exports=generateToken