import React from 'react';

function IdlePage({ socketMessage }) {
  return (
    <div>
      <div>Idle Page Content</div>
      <div>Socket Message: {socketMessage}</div>
    </div>
  );
}

export default IdlePage;
