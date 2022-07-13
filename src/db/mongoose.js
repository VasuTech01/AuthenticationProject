const mongoose = require("mongoose");
const chalk= require("chalk");
console.log(process.env.MongoUrl);

mongoose.connect("mongodb://127.0.0.1:27017/MyDB", {
    useNewUrlParser: true,
    keepAlive: true,
}).then(() => {
    const a=chalk.green.bold("Database connection completed successfully")
    console.log(a);
}).catch((err) => {
    
    console.log("error in connnecting to DB",err);

})



