
import { config } from "dotenv";
import express from "express"
import http from "http"

import cors from "cors"
import frontendRouter from "./src/routes/frontend.route.js";
import path from "path"
import { fileURLToPath } from 'url';
import { Server } from "socket.io"

config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
//dossier build du frontend
app.use(express.static(path.join(__dirname, './build')));


app.use(cors())

const server = http.createServer(app);
//const socket = require("socket.io");
const io = new Server(server);

const userRooms = {};

io.on("connect", (socket) => {
    console.log("new :", socket.id)

    //new user
    socket.on("join", ({ room }) => {
        userRooms[socket.id] = room
        socket.join(room)
        socket.to(room).emit('new-user', { id: socket.id, name: socket.handshake.query.name })

        console.log(socket.id, " joined ", room)

    })

    socket.on("offer", ({ offer, to }) => {
        socket.to(to).emit("offer", { from: socket.id, offer, name: socket.handshake.query.name })
        console.log(socket.id, " offer ")
    })

    socket.on("answer", ({ answer, to }) => {
        socket.to(to).emit("answer", { from: socket.id, answer })
        console.log(socket.id, " answer ")
    })


    //Screen share
    socket.on("share-screen-start", () => {
        socket.to(userRooms[socket.id]).emit('share-screen-start', socket.id)
        console.log(socket.id, " share-screen-start ")

    })

    socket.on("share-screen-offer", ({ offer, to }) => {
        socket.to(to).emit("share-screen-offer", { from: socket.id, offer })
        console.log(socket.id, " share-screen-offer ")
    })

    socket.on("share-screen-answer", ({ answer, to }) => {
        socket.to(to).emit("share-screen-answer", { from: socket.id, answer })
        console.log(socket.id, " share-screen-answer ")
    })

    socket.on("message", (message) => {
        console.log(socket.id, " message ", message)
        io.to(userRooms[socket.id]).emit('message', { id: socket.id,name: socket.handshake.query.name , message })
    })


    socket.on('disconnect', () => {
        console.log("user ", socket.id, " gone")
        socket.to(userRooms[socket.id]).emit('user-disconnect', socket.id)
    })


})


app.use('/', frontendRouter)

const port = process.env.PORT || 8000

server.listen(port, () => console.log(`server is running on port ${port}`));


