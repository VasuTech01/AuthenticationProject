const express = require('express');
const cookieSession=require('cookie-session');
const DbConn = require("./db/mongoose");
const chalk = require('chalk');
const socketIO = require('socket.io');
const cors= require('cors');
const { Server } = socketIO;
const path = require('path');
const userRouter = require("./routers/user");
const { createServer } = require("http");
const app = express();
const httpServer = createServer(app);
const io = socketIO(httpServer,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
// const io = new Server();
const port = process.env.PORT || 8080;
var connectedUsers = [];
console.log(process.env.PORT);
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(cors());
app.use(cookieSession({
    name: "Session",
    keys: ["India", "Haryana"],
    maxAge: 24*60 * 60,
    httpOnly:true,
}));
app.use((req, res, next) => {
    // req.session.Date = new Date().getDate();
    req.session.Date = new Date();
    next();
})

app.use(userRouter);
app.get("/",(req, res) => {
    try {
        res.json(req.session);
    } catch (err) {
        res.json(err);
    }
})
io.on("connection", (socket) => {
    console.log("client connected", socket.id);
   
    console.log("connected users", connectedUsers);
    socket.on("add-user-to-list", (msg) => {
        if (connectedUsers.length === 0) {
            connectedUsers.push({ username: msg, id: socket.id });
        } else {
             
            var user = connectedUsers.filter(user => user.id !== socket.id);
            user.push({ username: msg, id: socket.id });
            connectedUsers = user;
        }
      
        console.log("connected users", connectedUsers);
    })
    socket.on("get-user-list", (msg, callback) => {
             
        if (connectedUsers.length <= 1) {
        callback([]);
        }
        else {
            var users = connectedUsers.filter(user => user.id !== socket.id);
            callback(users);
        }
         

    })

    socket.on("disconnecting", () => {
        connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
        io.emit("update-user-List", connectedUsers);
        console.log("client Disconnected",connectedUsers);
    });
})


app.listen(port, () => {

        console.log("Client connnected",port);
})  
io.listen(8081);

