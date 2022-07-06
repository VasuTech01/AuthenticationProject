const mongoose = require("mongoose");
console.log(process.env.MongoUrl);
mongoose.connect("mongodb://127.0.0.1:27017/MyDB", {
    useNewUrlParser: true,
    keepAlive: true,
}).then(() => {
    console.log("connected to Db");
}).catch((err) => {
    
    console.log("error in connnecting to DB",err);

})



