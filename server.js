const express = require("express")
const { join } = require("path")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const { v4: uuidV4} = require("uuid")

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room})
})

io.on('connection', socket => {
    //when someone connects to the room 
    //whenever we join the room we are passing room id and user id
    socket.on('join-room', (roomId, userId) => {
        //make the current socket to join a room
        socket.join(roomId)

        //send a message to the room that we are currently in 
        //broadcast means send it to everyone else in this room but dont send it back to me
        socket.broadcast.to(roomId).emit('user-connected', userId)
    })
})

server.listen(3000) 