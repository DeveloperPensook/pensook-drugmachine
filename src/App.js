import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import IdlePage from "./pages/Idle.jsx";
import ShowPin from "./pages/ShowPin.jsx";
import StockList from "./pages/StockList.jsx";
import Success from "./pages/Success.jsx";
import Login from "./pages/Login.jsx";
import Failed from "./pages/Failed.jsx";
import Cookies from 'js-cookie';
import axios from 'axios';
import OpenIcon from "./asset/open-icon.png";
import CloseIcon from "./asset/close-icon.png";
import SuccessIcon from "./asset/success-icon.png";

function App() {
  const [currentPage, setCurrentPage] = useState(<IdlePage />);
  const [socketData, setSocketData] = useState({ page: null });
  const [socketData2, setSocketData2] = useState({ page: null });

  useEffect(() => {
    const socket = io(
      process.env.REACT_APP_IS_PROD == 'true'
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
    const socket2 = io(`http://localhost:6007`);

    socket2.on("message", (data) => {
      setSocketData2(JSON.parse(data));
      console.log(JSON.parse(data))
    });

    return () => {
      socket2.disconnect();
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
              if (socketData.message.entryType !== 'Pickup Medicine') {
                setCurrentPage(
                  <div className="App">
                    <div className='dialog-section'></div>
                    <div className='dialog-card'>
                      <img src={OpenIcon} alt="OpenIcon" />
                      เปิดตู้ยาแล้ว
                    </div>
                    <div className="page-container">
                      {currentPage}
                    </div>
                  </div>
                );

                setTimeout(() => {
                  Object.assign(socketData.message, { drugMachineCode: cookieSession.Code })
                  setCurrentPage(<StockList socketMessage={socketData.message} />);
                }, 2000);
              } else {
                Object.assign(socketData.message, { drugMachineCode: cookieSession.Code })
                setCurrentPage(<StockList socketMessage={socketData.message} />);
              }
              break;
            case 'success':
              if (socketData.entryType == 'Pickup Medicine') {
                setCurrentPage(
                  <div className="App">
                    <div className='dialog-section'></div>
                    <div className='dialog-card'>
                      <img src={SuccessIcon} alt="SuccessIcon" />
                      เบิกยาสำเร็จ
                    </div>
                    <div className="page-container">
                      {currentPage}
                    </div>
                  </div>
                );

                setTimeout(() => {
                  setCurrentPage(<IdlePage />)
                }, 2000);
              }
              if (socketData.entryType == 'Add Stock') {
                setCurrentPage(
                  <div className="App">
                    <div className='dialog-section'></div>
                    <div className='dialog-card'>
                      <img src={SuccessIcon} alt="SuccessIcon" />
                      เติมยาสำเร็จ
                    </div>
                    <div className="page-container">
                      {currentPage}
                    </div>
                  </div>
                );

                setTimeout(() => {
                  setCurrentPage(<IdlePage />)
                }, 2000);
              }
              if (socketData.entryType == 'Open Drug Machine') {
                setCurrentPage(
                  <div className="App">
                    <div className='dialog-section'></div>
                    <div className='dialog-card'>
                      <img src={CloseIcon} alt="OpenIcon" />
                      ปิดตู้ยาแล้ว
                    </div>
                    <div className="page-container">
                      {currentPage}
                    </div>
                  </div>
                );

                setTimeout(() => {
                  setCurrentPage(<IdlePage />)
                }, 2000);
              }
              break;
            case 'failed':
              setCurrentPage(<Failed socketMessage={socketData.message} />);
              break;
            case 'cancel':
              setCurrentPage(<IdlePage />)
              break;
            default:
              setCurrentPage(null);
              break;
          }
        }
      } else if (cookieSession.Code && socketData2.drugMachineCode) {
        if (cookieSession.Code == socketData2.drugMachineCode) {
          const requestData = {
            ...(socketData2.stockLedgerEntryId
              ? { stockLedgerEntryId: socketData2.stockLedgerEntryId }
              : { drugMachineOpenHistoryId: socketData2.drugMachineOpenHistoryId }),
          };

          const BACKEND_URL = process.env.REACT_APP_IS_PROD == 'true'
            ? process.env.REACT_APP_BACKEND_URL_PROD
            : process.env.REACT_APP_BACKEND_URL

          axios
            .post(`${BACKEND_URL}/auth/updateStatusToApproved`, requestData)
            .then((response) => {
              console.log('POST request successful:', response.data);
              setCurrentPage(<Success />);
            })
            .catch((error) => {
              console.error('Error making POST request:', error);
            });
        }
      } else {
        setCurrentPage(<IdlePage />)
      }
    } else {
      setCurrentPage(<Login />)
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
