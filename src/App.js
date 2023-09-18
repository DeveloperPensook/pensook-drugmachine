import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import IdlePage from "./pages/Idle.jsx";
import ShowPin from "./pages/ShowPin.jsx";
import StockList from "./pages/StockList.jsx";
import Success from "./pages/Success.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState(null);
  const [socketData, setSocketData] = useState({ page: null });

  useEffect(() => {
    const socket = io('http://localhost:4000');

    socket.on("message", (data) => {
      setSocketData(JSON.parse(data));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    switch (socketData.page) {
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
  }, [socketData]);

  return (
    <div className="App">
      <div className="page-container">
        {currentPage}
      </div>
    </div>
  );
}

export default App;
