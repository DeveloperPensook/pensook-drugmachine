import React, { useState } from 'react';
import axios from 'axios';

function StockList({ socketMessage }) {
  const [pin, setPin] = useState('');

  const updateStatusToApproved = () => {
    const requestData = {
      ...(socketMessage.stockLedgerEntryId
        ? { stockLedgerEntryId: socketMessage.stockLedgerEntryId }
        : { drugMachineOpenHistoryId: socketMessage.drugMachineOpenHistoryId }),
    };
    const BACKEND_URL = process.env.IS_PROD === '1'
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL

    axios
      .post(`${BACKEND_URL}/api/stockLedger/updateStatusToApproved`, requestData)
      .then((response) => {
        console.log('POST request successful:', response.data);
      })
      .catch((error) => {
        console.error('Error making POST request:', error);
      });
  };

  return (
    <div>
      <div>Stock List Page Content</div>
      {socketMessage.drugMachineOpenHistoryId ? (
        <div>drugMachineOpenHistoryId: {socketMessage.drugMachineOpenHistoryId}</div>
      ) : (
        <div>
          <div>stockLedgerEntryId: {socketMessage.stockLedgerEntryId}</div>
          <div>stockList: {JSON.stringify(socketMessage.stockList)}</div>
        </div>
      )}
      <button onClick={updateStatusToApproved}>Update Status to Approved</button>
    </div>
  );
}

export default StockList;
