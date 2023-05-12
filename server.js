const logger = require('morgan')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3000
const ROOT_DIR = '/public' //root directory for our static pages

//Middleware
app.use( logger('dev'))
app.use(express.static(__dirname + ROOT_DIR)) //provide static server
app.use((req,res)=>{
  res.status(404).send('404 error: webpage doesnt exist')
})

let arr = []

//Socket Server
io.on('connection', function(socket){

    socket.on('validClientConnection', function(data){ //when a connection is made append the clients username and respective socket id
        
        user = data + socket.id
        arr.push(user.split("/"))
        console.log(arr)
    })

    socket.emit('serverSays', {msg: 'You are connected to the chat server!', socket: null, isPriv: false}) // when connection is established notify the user that they're properly connected to the chat room
    socket.on('clientSays', function(data) { //when a client socket emits a message check to see if its a private message by manipluating their message to see if the socket follows a particular syntax, if so then
                                            //then display the message to the particular clients' sockets as a private message by their requested username(s), otherwise emit message to all the clients in the server as a public message
        console.log('RECEIVED: ' + data + " FROM: " + socket.id)
        
        let indexOfFirst = data.indexOf(":")
        let indexOfSecond = data.indexOf(":", (indexOfFirst + 1))
        let namesOfInterest = data.substring(indexOfFirst+2, indexOfSecond)
        let privMsg = data.substring(0,indexOfFirst+2) + data.substring(indexOfSecond+2)

        namesOfInterest = namesOfInterest.split(",")
        for(let i = 0; i < namesOfInterest.length; i++){
            namesOfInterest[i] = namesOfInterest[i].trim()
        }

        if(!(namesOfInterest[0].includes(":"))){
            for(let i = 0; i < arr.length; i++){
                if(namesOfInterest.includes(arr[i][0])){
                    io.to(arr[i][1]).emit('serverSays', {msg: privMsg, socket: socket.id, isPriv: true})
                }
            }
            socket.emit('serverSays', {msg: privMsg, socket: socket.id, isPriv: true})
        } else{
            io.emit('serverSays', {msg: data, socket: socket.id, isPriv: false})
        }
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT} CNTL-C to Quit`)
    console.log('To Test')
    console.log('http://localhost:3000/index.html')
})