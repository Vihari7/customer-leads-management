import React from 'react';
import { Button } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateLead from './pages/CreateLead';
import ShowLead from './pages/ShowLead';
import EditLead from './pages/EditLead';
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/leads/create' element={<CreateLead />} />
      <Route path='/leads/details/:id' element={<ShowLead />} />
      <Route path='/leads/edit/:id' element={<EditLead />} />
    </Routes>
  );
};

export default App;