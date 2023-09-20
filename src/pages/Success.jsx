import React from 'react';

function Success({ socketMessage }) {
  return (
    <div>
      <div>Success Page Content</div>
      <div>Socket Message: {socketMessage}</div>
    </div>
  );
}

export default Success;
