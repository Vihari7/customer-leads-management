import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    TextField, 
    Button, 
    Paper, 
    MenuItem, 
    Select, 
    InputLabel, 
    FormControl,
    Typography 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const EditLead = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState(''); // New field for Edit
  const [priority, setPriority] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL

  // 1. Fetch the OLD data first so we can fill the form
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/leads/${id}`)
    .then((response) => {
        setName(response.data.name);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setSource(response.data.source);
        setStatus(response.data.status);
        setPriority(response.data.priority);
        setLoading(false);
    }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
    });
  }, []) // Empty array means run only once when page loads

  // 2. Handle Update
  const handleEditLead = () => {
    const data = {
      name,
      email,
      phone,
      source,
      status,
      priority,
    };

    setLoading(true);
    
    axios
      .put(`http://localhost:5555/leads/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/'); // Go back to Dashboard
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  };

  return (
    <div className='p-4 bg-gray-50 min-h-screen'>
      <BackButton />
      
      <div className='flex flex-col items-center justify-center mt-8'>
        <Typography variant="h4" gutterBottom>
            Edit Lead
        </Typography>

        {loading ? <Spinner /> : ''}

        <Paper elevation={3} className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto gap-y-6'>
          
          <TextField 
            label="Client Name" variant="outlined" fullWidth required
            value={name} onChange={(e) => setName(e.target.value)}
          />

          <TextField 
            label="Email" variant="outlined" fullWidth required type="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />

          <TextField 
            label="Phone Number" variant="outlined" fullWidth 
            value={phone} onChange={(e) => setPhone(e.target.value)}
          />

          {/* Status Dropdown (Only available in Edit) */}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
            >
                <MenuItem value={"New"}>New</MenuItem>
                <MenuItem value={"Contacted"}>Contacted</MenuItem>
                <MenuItem value={"Proposal Sent"}>Proposal Sent</MenuItem>
                <MenuItem value={"Negotiation"}>Negotiation</MenuItem>
                <MenuItem value={"Converted"}>Converted</MenuItem>
                <MenuItem value={"Lost"}>Lost</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Source</InputLabel>
            <Select
                value={source}
                label="Source"
                onChange={(e) => setSource(e.target.value)}
            >
                <MenuItem value={"Website"}>Website</MenuItem>
                <MenuItem value={"LinkedIn"}>LinkedIn</MenuItem>
                <MenuItem value={"Referral"}>Referral</MenuItem>
                <MenuItem value={"Ad Campaign"}>Ad Campaign</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
            >
                <MenuItem value={"Hot"}>Hot</MenuItem>
                <MenuItem value={"Warm"}>Warm</MenuItem>
                <MenuItem value={"Cold"}>Cold</MenuItem>
            </Select>
          </FormControl>

          <Button 
            variant="contained" color="primary" size="large" startIcon={<SaveIcon />}
            onClick={handleEditLead} className='mt-4'
          >
            Update Lead
          </Button>

        </Paper>
      </div>
    </div>
  );
};

export default EditLead;