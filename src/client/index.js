import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';

const socket = io()

// socket.on("test", data => {
//     console.log("we got the test message!!")
// })

ReactDOM.render(<App socket={socket} />, document.getElementById('root'));