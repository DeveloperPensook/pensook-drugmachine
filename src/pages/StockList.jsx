import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

function StockList({ socketMessage }) {
  const [pin, setPin] = useState("");

  useEffect(() => {
    const sessionValue = Cookies.get("session");
    const decodedString = decodeURIComponent(sessionValue);
    const cookieSession = JSON.parse(decodedString);
    let address = [];
    let value = [];
    if (socketMessage.entryType == "Pickup Medicine") {
      socketMessage.stockList.forEach(function (row) {
        address.push(row.slotAddress)
        value.push(Math.abs(row.qty))
      })
    } else {
      address = [`${cookieSession.openDoorAddress}`]
      value = ["1"]
    }
    let requestData = {
      ip: cookieSession.ipAddress,
      modbusPort: cookieSession.port,
      slaveId: cookieSession.slaveId,
      address: address,
      value: value,
      drugMachineCode: socketMessage.drugMachineCode,
      entryStatusAddress: cookieSession.entryStatusAddress,
      doorStatusAddress: cookieSession.doorStatusAddress,
      entryType: socketMessage.entryType
    }

    function postDataWithTimeout(url, data, maxTime) {
      let timeout;
      const cancelToken = axios.CancelToken.source();
    
      // Create a promise that resolves when the response is successful or an error occurs
      const requestPromise = new Promise((resolve, reject) => {
        axios
          .post(url, data, { cancelToken: cancelToken.token })
          .then((response) => {
            console.log("POST request successful:", response.data);
            resolve(response.data);
          })
          .catch((error) => {
            console.error("Error making POST request:", error);
            reject(error);
          });
      });
    
      // Create a promise that rejects after the specified timeout
      const timeoutPromise = new Promise((resolve, reject) => {
        timeout = setTimeout(() => {
          reject(new Error("Request timed out"));
          cancelToken.cancel("Request timed out");
        }, maxTime);
      });
    
      // Use Promise.race to handle either a successful response or a timeout
      return Promise.race([requestPromise, timeoutPromise])
        .then((result) => {
          clearTimeout(timeout);
          return result;
        })
        .catch((error) => {
          clearTimeout(timeout);
          throw error;
        });
    }

    const maxRequestTime = 5 * 60 * 1000;

    postDataWithTimeout("http://localhost:6007/api/stockLedger/drugMachineModbus", requestData, maxRequestTime)
      .then((response) => {
        if (response && response.success === true) {
          const BACKEND_URL =
            process.env.REACT_APP_IS_PROD == "true"
              ? process.env.REACT_APP_BACKEND_URL_PROD
              : process.env.REACT_APP_BACKEND_URL;

          axios
            .post(
              `${BACKEND_URL}/auth/closeEntryOnSuccess`,
              {pin: socketMessage.pin}
            )
            .then((response) => {
              console.log("POST request successful:", response.data);
            })
            .catch((error) => {
              console.error("Error making POST request:", error);
            });
        } else {
          const BACKEND_URL =
            process.env.REACT_APP_IS_PROD == "true"
              ? process.env.REACT_APP_BACKEND_URL_PROD
              : process.env.REACT_APP_BACKEND_URL;

          axios
            .post(
              `${BACKEND_URL}/auth/closeEntryOnPin`,
              {pin: socketMessage.pin, closeEntry: "After Pin Failed"}
            )
            .then((response) => {
              console.log("POST request successful:", response.data);
            })
            .catch((error) => {
              console.error("Error making POST request:", error);
            });
        }
      })
      .catch((error) => {
        const BACKEND_URL =
            process.env.REACT_APP_IS_PROD == "true"
              ? process.env.REACT_APP_BACKEND_URL_PROD
              : process.env.REACT_APP_BACKEND_URL;

          axios
            .post(
              `${BACKEND_URL}/auth/closeEntryOnPin`,
              {pin: socketMessage.pin, closeEntry: "Timeout Failed"}
            )
            .then((response) => {
              console.log("POST request successful:", response.data);
            })
            .catch((error) => {
              console.error("Error making POST request:", error);
            });
      });
    
    // axios
    //   .post(
    //     `http://localhost:6007/api/stockLedger/drugMachineModbus`,
    //     requestData
    //   )
    //   .then((response) => {
    //     console.log("POST request successful:", response.data);
    //     let requestData2 = {
    //       ip: cookieSession.ipAddress,
    //       modbusPort: cookieSession.port,
    //       slaveId: cookieSession.slaveId,
    //       address: [`${entryType == ' Pickup Medicine' ? entryStatusAddress : doorStatusAddress}}`],
    //       length: 0,
    //       entryType: getStatusModbus
    //     }
    //     axios
    //       .post(`http://localhost:6007/api/stockLedger/getStatusModbus`,
    //       requestData2
    //     ).then((response) => {
    //       console.log("POST request successfull:", response.data);
    //     })
    //   })
    //   .catch((error) => {
    //     console.error("Error making POST request:", error);
    //   });
  });

  const updateStatusToApproved = () => {
    const requestData = {
      ...(socketMessage.stockLedgerEntryId
        ? { stockLedgerEntryId: socketMessage.stockLedgerEntryId }
        : { drugMachineOpenHistoryId: socketMessage.drugMachineOpenHistoryId }),
    };
    const BACKEND_URL =
      process.env.REACT_APP_IS_PROD == "true"
        ? process.env.REACT_APP_BACKEND_URL_PROD
        : process.env.REACT_APP_BACKEND_URL;

    axios
      .post(
        `${BACKEND_URL}/api/stockLedger/updateStatusToApproved`,
        requestData
      )
      .then((response) => {
        console.log("POST request successful:", response.data);
      })
      .catch((error) => {
        console.error("Error making POST request:", error);
      });
  };

  return (
    <div>
      <div>Stock List Page Content</div>
      {socketMessage.drugMachineOpenHistoryId ? (
        <div>
          drugMachineOpenHistoryId: {socketMessage.drugMachineOpenHistoryId}
        </div>
      ) : (
        <div>
          <div>stockLedgerEntryId: {socketMessage.stockLedgerEntryId}</div>
          <div>stockList: {JSON.stringify(socketMessage.stockList)}</div>
        </div>
      )}
      <button onClick={updateStatusToApproved}>
        Update Status to Approved
      </button>
    </div>
  );
}

export default StockList;
