import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';

const socket = io()

window.cheat = (password, type, value) => {
    socket.emit("cheats", password, type, value)
}

// socket.on("test", data => {
//     console.log("we got the test message!!")
// })

ReactDOM.render(<App socket={socket} />, document.getElementById('root'));