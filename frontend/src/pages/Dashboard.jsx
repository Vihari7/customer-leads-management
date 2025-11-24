import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Chip 
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/leads')
      .then((response) => {
        // Response.data has { count: 5, data: [...] }
        setLeads(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Helper function for Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'info';
      case 'Contacted': return 'warning';
      case 'Converted': return 'success';
      case 'Lost': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className='p-4 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Leads Dashboard</h1>
        <Link to='/leads/create'>
          <Button variant="contained" startIcon={<Add />}>
            Add Lead
          </Button>
        </Link>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell className="font-bold">No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead, index) => (
                <TableRow key={lead._id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell component="th" scope="row" className="font-semibold">
                    {lead.name}
                  </TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <Chip 
                        label={lead.status} 
                        color={getStatusColor(lead.status)} 
                        size="small" 
                        variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                     <span className={`${lead.priority === 'Hot' ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                        {lead.priority}
                     </span>
                  </TableCell>
                  <TableCell align="center">
                    <div className='flex justify-center gap-x-2'>
                      <Link to={`/leads/details/${lead._id}`}>
                        <IconButton color="primary">
                            <Visibility />
                        </IconButton>
                      </Link>
                      <Link to={`/leads/edit/${lead._id}`}>
                        <IconButton color="warning">
                            <Edit />
                        </IconButton>
                      </Link>
                      <Link to={`/leads/delete/${lead._id}`}>
                         <IconButton color="error">
                            <Delete />
                        </IconButton>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Dashboard;