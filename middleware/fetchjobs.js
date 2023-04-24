const JobsCollection=require("../Models/Jobs")
const UserCollection = require("../Models/User");


const fetchjobs=(req,res,next)=>{
    //get user from the jwt token and add to req object
    const id=req.header("id");
    if(!id){
        res.status(401).send({error:"please authenticate using a valid id"})

    }
    try {
        
        const data = UserCollection.find({ _id: id })
        console.log(data.user)
        req.user=data;
        next();
    } catch (error) {
        res.status(401).send({error:"please authenticate using a valid token"})
        
    }
}



module.exports=fetchjobs