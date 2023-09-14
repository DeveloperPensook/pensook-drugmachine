import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (newMessage) => {
      setMessages([...messages, newMessage]);
    });
  }, [messages]);

  const sendMessage = () => {
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div className="App">
      <h1>Real-Time Chat App</h1>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
