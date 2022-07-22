const express = require('express');
const cookieSession=require('cookie-session');
const DbConn = require("./db/mongoose");
const chalk=require('chalk');
const path = require('path');
const userRouter = require("./routers/user");
const port = process.env.PORT || 8080;
console.log(process.env.PORT);
const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(cookieSession({
    name: "Session",
    keys: ["India", "Haryana"],
    maxAge: 24*60 * 60,
    httpOnly:true,
}));
app.use((req, res, next) => {
    // req.session.Date = new Date().getDate();
    req.session.Date = new Date().getDate();
    next();
})
app.use(userRouter);
app.get("/",(req, res) => {
    try {
        res.send(req.session);
    } catch (err) {
        res.json(err);
    }
})





app.listen(port, () => {
        console.log("Client connnected",port);
    })   

