import React, { useState, useEffect } from 'react';

function Failed({ socketMessage }) {
  // const [countdown, setCountdown] = useState(5);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     if (countdown > 0) {
  //       setCountdown(countdown - 1);
  //     } else {
  //       clearInterval(timer);
  //       window.location.reload(true);
  //     }
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [countdown]);

  return (
    <div>
      <div>Failed Page Content</div>
      <div>Socket Message: {socketMessage}</div>
    </div>
  );
}

export default Failed;
