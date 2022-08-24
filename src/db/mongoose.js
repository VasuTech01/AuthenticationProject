const mongoose = require("mongoose");
const chalk= require("chalk");
console.log(process.env.MongoUrl);
var conFlag = false;
var db = process.env.MongoUrl.toString();
var clearIn = setInterval(function () { 
    mongoose.connect(db, {
        useNewUrlParser: true,
        keepAlive: true,
    }).then(() => {
        const a=chalk.green.bold("Database connection completed successfully")
        console.log(a);
        conFlag = true;
        clearInterval(clearIn);
    }).catch((err) => {
        console.log("error in connnecting to DB", err);
        conFlag = false;
    })
}, 3000);

module.exports = { conFlag };