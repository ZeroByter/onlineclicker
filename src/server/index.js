const os = require('os');
const express = require('express');
const app = express();

const http = require("http").Server(app)
const io = require("socket.io")(http)
const mysql = require("mysql")

const isDev = process.env.NODE_ENV !== "production"

app.use(express.static('dist'));

//api example
//app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

let connectionData = process.env.JAWSDB_URL
if(isDev) connectionData = {
    host: "localhost",
    user: "root",
    password: "",
    database: "onlineclicker"
}

var connection = mysql.createConnection(connectionData)

connection.connect()

connection.query("SELECT data FROM maindata WHERE id='points'", (error, results, fields) => {
    if(error) throw error
    
    points = parseInt(results[0].data)
})

setInterval(() => {
    connection.query("UPDATE maindata SET data=? WHERE id='points'", [points], (error, results, fields) => {
        if(error) throw error
    })
}, 1000 * 30)

let points = 0

let sockets = {}

io.on("connection", socket => {
    socket[socket.id] = {
        socket,
        cursorPosition: null,
    }

    socket.emit("pointsData", points)

    socket.on("cheats", (password, type, value) => {
        let cheatPassword = process.env.CHEATS_PASSWORD
        if(isDev) cheatPassword = "meme"

        if(cheatPassword == password){
            if(type === "setPoints"){
                points = value
                io.emit("pointsData", points)
                io.emit("cursorClick", {type: "center"})
            }
        }
    })

    socket.on("disconnect", reason => {
        socket.broadcast.emit("userDisconnect", socket.id)

        delete sockets[socket.id]
    })

    socket.on("cursorMove", data => {
        socket[socket.id].cursorPosition = data
        socket.broadcast.emit("cursorMove", {
            id: socket.id,
            newPosition: data
        })
    })

    socket.on("cursorClick", data => {
        socket[socket.id].cursorPosition = data
        socket.broadcast.emit("cursorClick", {
            type: "normal",
            id: socket.id,
            newPosition: data
        })
    })

    socket.on("mainClick", () => {
        points += 1
        io.emit("pointsData", points)
        socket.broadcast.emit("cursorClick", {type: "center"})
    })
})

http.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));