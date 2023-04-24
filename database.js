const mongoose=require("mongoose");
const mongouri="mongodb+srv://scheduler:C9IixdpHJzfy3jng@cluster0.dmnsn.mongodb.net/job_tracker?retryWrites=true&w=majority"


const connectToMongo=()=>{
    mongoose.connect(mongouri,()=>{
        console.log("connected to mongo")
    })
}
module.exports=connectToMongo;