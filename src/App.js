import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import IdlePage from "./pages/Idle.jsx";
import ShowPin from "./pages/ShowPin.jsx";
import StockList from "./pages/StockList.jsx";
import Success from "./pages/Success.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState(<IdlePage />);
  const [socketData, setSocketData] = useState({ page: null });
  const [userIpAddress, setUserIpAddress] = useState('');

  useEffect(() => {
    fetch('https://api64.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setUserIpAddress(data.ip))
      .catch(error => console.error('Error fetching IP address:', error));

    const socket = io(
      process.env.IS_PROD === '1'
        ? process.env.REACT_APP_BACKEND_URL_PROD
        : process.env.REACT_APP_BACKEND_URL
    );

    socket.on("message", (data) => {
      setSocketData(JSON.parse(data));
      console.log(JSON.parse(data))
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userIpAddress == socketData.ipAddress) {
      switch (socketData.page) {
        case 'show-pin':
          setCurrentPage(<ShowPin socketMessage={socketData.message} />);
          break;
        case 'stock-list':
          setCurrentPage(<StockList socketMessage={socketData.message} />);
          break;
        case 'success':
          setCurrentPage(<Success socketMessage={socketData.message} />);
          break;
        default:
          setCurrentPage(null);
          break;
      }
    } else {
      setCurrentPage(<IdlePage />);
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
