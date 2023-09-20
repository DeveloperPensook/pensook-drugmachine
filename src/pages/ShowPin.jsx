import React, { useState, useEffect } from 'react';

function ShowPin({ socketMessage }) {
  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);


  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div>
      <div>ShowPin Page Content</div>
      <div>Socket Message: {socketMessage}</div>
      <div>Countdown: {minutes} minutes {seconds} seconds</div>
    </div>
  );
}

export default ShowPin;
