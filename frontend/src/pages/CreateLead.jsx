import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const CreateLead = () => {
  // Define State for form fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('');
  const [priority, setPriority] = useState('Cold'); // Default value
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Handle Form Submission
  const handleSaveLead = () => {
    // Simple validation
    if(!name || !email || !source) {
        alert("Please fill in all required fields");
        return;
    }

    const data = {
      name,
      company,
      email,
      phone,
      source,
      priority,
    };

    setLoading(true);
    
    // Send POST request to backend
    axios
      .post('http://localhost:5555/leads', data)
      .then(() => {
        setLoading(false);
        // Redirect back to Home
        navigate('/'); 
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
            Create New Lead
        </Typography>

        {loading ? <Spinner /> : ''}

        <Paper elevation={3} className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto gap-y-6'>
          
          {/* Name Input */}
          <TextField 
            label="Client Name" 
            variant="outlined" 
            fullWidth 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
            {/* Company Input */}
            <TextField 
            label="Company Name" 
            variant="outlined" 
            fullWidth 
            value={company} 
            onChange={(e) => setCompany(e.target.value)} 
            />

          {/* Email Input */}
          <TextField 
            label="Email" 
            variant="outlined" 
            fullWidth 
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Phone Input */}
          <TextField 
            label="Phone Number" 
            variant="outlined" 
            fullWidth 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Source Input (Where did they come from?) */}
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

          {/* Priority Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
            >
                <MenuItem value={"Hot"}>Hot </MenuItem>
                <MenuItem value={"Warm"}>Warm </MenuItem>
                <MenuItem value={"Cold"}>Cold </MenuItem>
            </Select>
          </FormControl>

          {/* Save Button */}
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSaveLead}
            className='mt-4'
          >
            Save Lead
          </Button>

        </Paper>
      </div>
    </div>
  );
};

export default CreateLead;