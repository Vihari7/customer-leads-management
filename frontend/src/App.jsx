import React from 'react';
import { Button } from '@mui/material';

const App = () => {
  return (
    <div className='bg-gray-100 h-screen p-10'>
      <h1 className='text-3xl font-bold text-blue-600 mb-5'>
        Setup Successful!
      </h1>
      <Button variant="contained" color="primary">
        Test Button
      </Button>
    </div>
  );
};

export default App;