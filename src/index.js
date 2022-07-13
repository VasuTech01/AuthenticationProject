const express = require('express');
const cookieParser=require('cookie-parser');
const DbConn = require("./db/mongoose");
const chalk=require('chalk');
const path = require('path');
const userRouter = require("./routers/user");
const port = process.env.PORT || 3000;
console.log(process.env.PORT);
const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
     
    console.log("cookies", req.cookies);
    console.log("signed cookies", req.signedCookies);
    next();
})

app.use(userRouter);

app.get("/", (req, res) => {
    res.send("Welcome");
})








app.listen(port, () => {
    console.log("Client connnected");
})