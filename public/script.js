const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: '/', 
    port: '3001'
})

//get refrence to another video 
const myVideo = document.createElement('video')
myVideo.muted = true

//created variable to keep track of the users who leave the room
const peers = {}
//connect our video
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })


    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    if(peers[userId]) peers[userId].close()
})


myPeer.on('open', id => {
    //we can change the 10 with user id that we make when login database
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideStream => {
        addVideoStream(video, userVideStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    //allow us to play our video
    video.srcObject = stream

    //when video is loded play it
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}