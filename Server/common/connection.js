const mongoose = require("mongoose")
const MongoURL = "mongodb+srv://cirilando2244:Cirilteddy2244@cluster0.prij0xn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const Connect = ()=>{
    mongoose.connect(MongoURL) 
    .then(() => {
        console.log("Mongodb is connected")
        
    }).catch((err) => {
        console.log("Not Connected",err)
    });
}
module.exports = Connect; 