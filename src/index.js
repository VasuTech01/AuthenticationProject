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
           console.log("inside get-user-list", msg);   
        if (connectedUsers.length < 1) {
        callback([]);
        }
        else {
            var users = connectedUsers.filter(user => user.id !== socket.id);
            callback(users);
        }
    })


    socket.on("sent-message", (data) => {
        console.log(data);
        console.log(socket.rooms);
        io.in(data.roomid).emit("message-Received",data);
       })

    socket.on("call-made", (calledUsername, calledUserid, callingUserid) => {
        console.log("inside callmade",calledUsername,calledUserid,callingUserid);
        io.to(calledUserid).emit("allow-user", calledUsername, callingUserid);
    })
    socket.on("create-call", (callingUserid, calledUserid) => {
        console.log("inside create-call",callingUserid, calledUserid );
        var roomid = Math.random().toString()+callingUserid+calledUserid;
        var callingUsername = connectedUsers.find(user => user.id === callingUserid).username;
        var calledUsername = connectedUsers.find(user => user.id === calledUserid).username;
        io.to(callingUserid).emit("Enter-call", roomid, calledUsername,calledUserid);
        io.to(calledUserid).emit("Enter-call", roomid, callingUsername,callingUserid);
   
    })
    socket.on("create-room", (rid) => {
        socket.join(rid);  
        console.log("joinin room", rid,socket.id);
  })
    socket.on("stop-call", (uid) => {
        io.to(uid).emit("call-not-allowed");
        // socket.on("")
    });
    socket.on("end-request", (id1, id2) => {
        console.log("inside end-request",id1,id2);
        io.to(id1).to(id2).emit("end-call");
 
    })


    ////RTC Event handlers

    socket.on("offermade", (data) => {
        console.log("offermade called", data);
        io.to(data.to).emit("call-made", {
            offer: data.offer,
            socket:socket.id
         })
    })
    socket.on("make-answer", (data) => {
        console.log("make-answer called", data);
        io.to(data.to).emit("answer-made", {
            socket: socket.id,
            answer:data.answer
        })
    })
    socket.on("icecandidate-made", (data) => {
        console.log("icecandidate-made",data);
        io.to(data.to).emit("icecandidate-received", {
            iceCandidate: data.iceCandidate,
            socket:socket.id,
        })
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

