const socket = io('/')

//we can change the 10 with user id that we make when login database
socket.emit('join-room', ROOM_ID, 10)


//now we can listen to the event
socket.on('user-connected', userId => {
    console.log('user connected: ' + userId)
})