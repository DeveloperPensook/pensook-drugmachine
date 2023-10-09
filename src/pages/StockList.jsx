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
    
    axios
      .post(
        `http://localhost:6007/api/stockLedger/drugMachineModbus`,
        requestData
      )
      .then((response) => {
        
      })
      .catch((error) => {
        
      });
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
        `${BACKEND_URL}/auth/updateStatusToApproved`,
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
