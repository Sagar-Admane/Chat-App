import express from "express";
import env from "dotenv";
import cors from "cors"
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoute from "./routes/messageRoute.js";
import { Server } from "socket.io";

const app = express();
env.config();
app.use(cors({ origin: "*" })); connectDB();
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("API is running");
})

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoute);



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,()=>{
    console.log("Port started");
})

const allowedOrigins = [
    "https://chat-app-git-main-sagar-admanes-projects.vercel.app", 
    "https://chat-app-omega-sandy.vercel.app" 
  ];

const io = new Server(server,{
    pingTimeout : 60000,
    cors :{
        origin : allowedOrigins,
        methods : ["GET","POST"],
        credentials : true
    },
    transports : ["websocket", "polling"]
})

io.on("connection", (socket)=>{
    console.log('connected to socket.io');
    socket.on('setup',(userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log("User joined room : "+room);
    });

    socket.on('typing',(room)=>socket.in(room).emit("typing"));
    socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        if(!chat.users) return console.log("chat.users is not defined");
        chat.users.forEach(user => {
            if(user._id === newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        })
    })
})