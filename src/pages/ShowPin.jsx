import React, { useState, useEffect } from 'react';

function ShowPin({ socketMessage }) {
  const [countdown, setCountdown] = useState(300); // Initial countdown value is 300 seconds

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        // When the countdown reaches 0, make the POST request
        clearInterval(timer); // Clear the timer
        callService(); // Call the service
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, [countdown]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const callService = () => {
    const requestBody = { pin: socketMessage.pin };
    const BACKEND_URL = process.env.REACT_APP_IS_PROD  == 'true'
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL

    fetch(`${BACKEND_URL}/api/stockLedger/closeEntryOnPin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          console.log('POST request successful');
          window.location.reload(true);
        } else {
          console.error('POST request failed');
        }
      })
      .catch((error) => {
        console.error('Network error:', error);
      });
  };

  return (
    <div>
      <div>ShowPin Page Content</div>
      <div>Date: {socketMessage.createTime}</div>
      <div>Activity: {socketMessage.activity}</div>
      <div>User: {socketMessage.user}</div>
      <div>Pin: {socketMessage.pin}</div>
      <div>Countdown: {minutes} minutes {seconds} seconds</div>
    </div>
  );
}

export default ShowPin;
