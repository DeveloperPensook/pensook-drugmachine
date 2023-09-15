import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import IdlePage from "./pages/Idle.jsx";
import ShowPin from "./pages/ShowPin.jsx";
import StockList from "./pages/StockList.jsx";
import Success from "./pages/Success.jsx";

const socket = io('http://localhost:4000');

function App() {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);

  useEffect(() => {
    socket.on('message', (newMessage) => {
      const parsedMessage = JSON.parse(newMessage);
      setMessages([...messages, parsedMessage.text]);

      switch (parsedMessage.page) {
        case 'idle':
          setCurrentPage(<IdlePage />);
          break;
        case 'show-pin':
          setCurrentPage(<ShowPin />);
          break;
        case 'stock-list':
          setCurrentPage(<StockList />);
          break;
        case 'success':
          setCurrentPage(<Success />);
          break;
        default:
          setCurrentPage(null);
          break;
      }
    });
  }, [messages]);

  return (
    <div className="App">
      <div className="page-container">
        {currentPage}
      </div>
    </div>
  );
}

export default App;