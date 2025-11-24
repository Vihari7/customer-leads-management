import React from 'react';
import { Button } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateLead from './pages/CreateLead';
import ShowLead from './pages/ShowLead';
import EditLead from './pages/EditLead';
import DeleteLead from './pages/DeleteLead';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/leads/create' element={<CreateLead />} />
      <Route path='/leads/details/:id' element={<ShowLead />} />
      <Route path='/leads/edit/:id' element={<EditLead />} />
      <Route path='/leads/delete/:id' element={<DeleteLead />} />
    </Routes>
  );
};

export default App;