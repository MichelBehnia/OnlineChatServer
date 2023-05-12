const socket = io('http://' + window.document.location.host)

function sendMessage(){ // sends a message from socket instance when send button is clicked
    let message = history.state.userText + ": " + document.getElementById('msgBox').value.trim()
    if(message === '') return
    socket.emit('clientSays', message)
    document.getElementById('msgBox').value = ''
}

function handleKeyDown(event){ // sends a message from socket instance after enter button is pressed
    const ENTER_KEY = 13
    if(event.keyCode === ENTER_KEY){
        sendMessage()
        return false
    }
}

function clearChat(){ // clears the chat history
    document.getElementById('messages').innerHTML = ""
}


console.log(history.state.validInput)

console.log(history.state.userText)

let thisSocket

if(history.state.validInput == true){ // esnures that a user has signed in from the index page in order to have access to the chat room, appends messages from clients to sockets' chatrooms 
                                    //with their respective characteristics based on what kind of message was sent
    socket.on("connect", () => {
        thisSocket = socket.id
        console.log(thisSocket)
    })

    socket.emit('validClientConnection', history.state.userText +"/")

    socket.on('serverSays', function(message){
        let msgDiv = document.createElement('div')
        if(message.socket == thisSocket){
            msgDiv.style.color = "blue"
        }
        
        if(message.isPriv == true){
            msgDiv.style.color = "red"
        }

        msgDiv.textContent = message.msg
        document.getElementById('messages').appendChild(msgDiv)
    })
    
    document.addEventListener('DOMContentLoaded', function(){
        document.getElementById('sendButton').addEventListener('click', sendMessage)
        document.getElementById('clearButton').addEventListener('click', clearChat)
        document.addEventListener('keydown', handleKeyDown)
    })
}



