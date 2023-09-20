import React from 'react';

function StockList({ socketMessage }) {
  return (
    <div>
      <div>Stock List Page Content</div>
      <div>Socket Message: {socketMessage}</div>
    </div>
  );
}

export default StockList;

