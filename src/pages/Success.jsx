import React, { useState, useEffect } from 'react';

function Success({ socketMessage }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        clearInterval(timer);
        window.location.reload(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div>
      <div>Success Page Content</div>
      <div>Socket Message: {socketMessage}</div>
      <div>Refreshing in {countdown} seconds...</div>
    </div>
  );
}

export default Success;
