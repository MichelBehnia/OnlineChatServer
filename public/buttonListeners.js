const symbols = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

const stateObj = {validInput: false, userText: ""}// object that gets passed onto the chatServer page with metadata on whether the user has properly signed in or not to use the chat room

function handleSignInButton(){ // make sure username is valid, if not notify user and wait until proper username is entered. if proper username is entered advance to the chatServer page.
    stateObj.userText = document.getElementById('userTextField').value

    if(!(symbols.test(stateObj.userText)) && isNaN(stateObj.userText.charAt(0))){
        stateObj.validInput = true
    }

    if(stateObj.validInput == false){
        document.getElementById('statusTitle').innerText = "Please enter a valid username!"
    } else{
        window.history.replaceState(stateObj, "Chat Server Sign-in Page", "/chatServer.html")
        location.reload()
    }
}





