import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Typography, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteLead = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL

  const handleDeleteLead = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/leads/${id}`)
      .then(() => {
        setLoading(false);
        // Go back to Dashboard after success
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        alert('Error deleting lead. Check console.');
        console.log(error);
      });
  };

  return (
    <div className='p-4 bg-gray-50 min-h-screen'>
      <BackButton />
      
      <h1 className='text-3xl my-4 text-center font-semibold'>Delete Lead</h1>
      
      {loading ? <Spinner /> : ''}
      
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto mt-10 bg-white shadow-lg'>
        
        <Typography variant="h5" className='text-center mb-8'>
            Are you sure you want to delete this lead?
        </Typography>
        
        <Typography variant="body1" className='text-center text-gray-500 mb-8'>
            This action cannot be undone.
        </Typography>

        <Box className='flex gap-4 w-full justify-center'>
            {/* Yes, Delete Button */}
            <Button 
                variant="contained" 
                color="error" 
                size="large"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteLead}
                className='w-full'
            >
                Yes, Delete it
            </Button>

            {/* Cancel Button (Just goes back) */}
            <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                onClick={() => navigate('/')} // Go back to home
                className='w-full'
            >
                Cancel
            </Button>
        </Box>
      </div>
    </div>
  );
};

export default DeleteLead;