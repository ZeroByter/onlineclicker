const os = require('os');
const express = require('express');
const app = express();

const http = require("http").Server(app)
const io = require("socket.io")(http)
const mysql = require("mysql");
const { purchaseUpgrade, allUpgrades, getUpgradeCount, getPointsPerSecond } = require('../shared/upgrades');

const isDev = process.env.NODE_ENV !== "production"

app.use(express.static('dist'));

//api example
//app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

let connectionData = process.env.JAWSDB_URL
if (isDev) connectionData = {
    host: "localhost",
    user: "root",
    password: "",
    database: "onlineclicker"
}

var connection = mysql.createConnection(connectionData)

connection.connect()

connection.query("SELECT data FROM pointsdata WHERE id='pointsdata'", (error, results, fields) => {
    if (error) throw error

    pointsData = JSON.parse(results[0].data)
})

setInterval(() => {
    connection.query("UPDATE pointsdata SET data=? WHERE id='pointsdata'", [JSON.stringify(pointsData)], (error, results, fields) => {
        if (error) throw error
    })
}, 1000 * 30)

const transmitPointsData = target => {
    target.emit("pointsData", pointsData)
}

setInterval(() => {
    pointsData.points += getPointsPerSecond(pointsData.upgrades)
    transmitPointsData(io)
}, 1000)

let pointsData = {
    points: 0,
    upgrades: {}
}

let sockets = {}

io.on("connection", socket => {
    socket[socket.id] = {
        socket,
        cursorPosition: null,
        name: "",
        pointsGiven: 0
    }

    transmitPointsData(socket)

    socket.on("cheats", (password, type, value) => {
        let cheatPassword = process.env.CHEATS_PASSWORD
        if (isDev) cheatPassword = "meme"

        if (cheatPassword == password) {
            if (type === "setPoints") {
                pointsData.points = value
                transmitPointsData(io)
                io.emit("cursorClick", { type: "center" })
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

    socket.on("setName", data => {
        data = data.substring(0, 12)

        socket[socket.id].name = data
        socket.broadcast.emit("setName", {
            id: socket.id,
            newName: data
        })
    })

    socket.on("mainClick", () => {
        pointsData.points += 1
        socket[socket.id].pointsGiven += 1

        transmitPointsData(io)
        socket.broadcast.emit("cursorClick", {
            type: "center",
            id: socket.id,
            pointsGiven: socket[socket.id].pointsGiven
        })
    })

    socket.on("purchaseUpgrade", upgradeId => {
        if (upgradeId in allUpgrades) {
            let price = allUpgrades[upgradeId].getPrice(getUpgradeCount(pointsData.upgrades, upgradeId))
            if (pointsData.points >= price) {
                purchaseUpgrade(pointsData.upgrades, upgradeId)
                console.log(price)
                pointsData.points -= price
                pointsData.points = +pointsData.points.toFixed(4)
                transmitPointsData(io)
            }
        }
    })
})

http.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));