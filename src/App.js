import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import IdlePage from "./pages/Idle.jsx";
import ShowPin from "./pages/ShowPin.jsx";
import StockList from "./pages/StockList.jsx";
import Success from "./pages/Success.jsx";
import Login from "./pages/Login.jsx";
import Cookies from 'js-cookie';

function App() {
  const [currentPage, setCurrentPage] = useState(<IdlePage />);
  const [socketData, setSocketData] = useState({ page: null });

  useEffect(() => {
    const socket = io(
      process.env.IS_PROD  == 'true'
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
    const sessionValue = Cookies.get('session');
    if (sessionValue) {
      const decodedString = decodeURIComponent(sessionValue);
      const cookieSession = JSON.parse(decodedString);
      if (cookieSession.Code && socketData.drugMachineCode) {
        if (cookieSession.Code == socketData.drugMachineCode) {
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
        }
      } else {
        setCurrentPage(<IdlePage/>)
      }
    } else {
      setCurrentPage(<Login/>)
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
