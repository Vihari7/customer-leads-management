import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { Paper, Typography, Divider, Chip, Grid } from '@mui/material';

const ShowLead = () => {
  const [lead, setLead] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/leads/${id}`)
      .then((response) => {
        setLead(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className='p-4 bg-gray-50 min-h-screen'>
      <BackButton />
      
      <h1 className='text-3xl my-4 font-bold text-gray-800'>Lead Details</h1>
      
      {loading ? (
        <Spinner />
      ) : (
        <Paper elevation={3} className='flex flex-col border-2 border-sky-400 rounded-xl w-full max-w-2xl p-8 mx-auto gap-y-4'>
            
            {/* Header with ID and Time */}
            <div className='mb-4'>
                <Typography variant="caption" display="block" gutterBottom className='text-gray-400'>
                    ID: {lead._id}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom className='text-gray-400'>
                    Created: {new Date(lead.createdAt).toLocaleString()}
                </Typography>
            </div>

            <Divider />

            {/* Main Details Grid */}
            <Grid container spacing={3} className='mt-2'>
                
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" className='text-gray-500'>Name</Typography>
                    <Typography variant="h5">{lead.name}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" className='text-gray-500'>Email</Typography>
                    <Typography variant="body1" className='text-blue-600'>{lead.email}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" className='text-gray-500'>Phone</Typography>
                    <Typography variant="body1">{lead.phone || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" className='text-gray-500'>Source</Typography>
                    <Typography variant="body1">{lead.source}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" className='text-gray-500'>Status</Typography>
                    <Chip label={lead.status} color="primary" variant="outlined" />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" className='text-gray-500'>Priority</Typography>
                    <span className={`${lead.priority === 'Hot' ? 'text-red-600 font-bold' : 'text-gray-800'}`}>
                        {lead.priority}
                    </span>
                </Grid>

            </Grid>
        </Paper>
      )}
    </div>
  );
};

export default ShowLead;