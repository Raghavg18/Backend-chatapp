import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
// import { Socket } from 'dgram';

const app = express();

const server = http.createServer(app) 

const io = new Server(server, {
    cors: {
        origin: ["https://frontend-in9r1fbyz-raghavg18s-projects.vercel.app",
        "https://frontend-in9r1fbyz-raghavg18s-projects.vercel.app"],
        credentials: true,
        methods: ["GET", "POST"],
    }
});

export const getRecieversId = (recieverId)=> {
    return users[recieverId]
}
const users = {}

io.on("connection", (socket)=> {
    console.log("New client connected", socket.id);
    const userId = socket.handshake.query.userId
    // console.log(userId)
    if(userId){
        users[userId] = socket.id;
        console.log("Hello",users)
    }
    io.emit("getOnline",Object.keys(users))

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
        delete users[userId];
        io.emit("getOnline",Object.keys(users))
    });
    });

export {app, io, server}