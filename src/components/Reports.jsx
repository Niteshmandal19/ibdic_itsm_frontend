import React from 'react';
import Filter from './Filter';

const Report = () => {
  return (
    <div>
      <h1>Tickets</h1>
      <Filter/>
      <p>Here is the list of Dashboard...</p>
      {/* Add your ticket list rendering logic here */}
    </div>
  );
};

export default Report; // Ensure this is a default export
