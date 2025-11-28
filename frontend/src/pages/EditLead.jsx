import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    TextField, 
    Button, 
    Paper, 
    MenuItem, 
    Select, 
    Typography, 
    Grid,
    Box
} from '@mui/material';

const CustomLabel = ({ children, required }) => (
  <Typography 
    variant="subtitle2" 
    sx={{ 
      fontWeight: 700, 
      color: '#64748b', 
      marginBottom: '4px', 
      textTransform: 'uppercase', 
      fontSize: '0.75rem' 
    }}
  >
    {children} {required && <span className="text-red-500">*</span>}
  </Typography>
);

const EditLead = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [source, setSource] = useState('');
  const [stage, setStage] = useState(''); // Status
  const [priority, setPriority] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`https://customer-leads-management.onrender.com/leads/${id}`)
    .then((response) => {
        const data = response.data;
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || '');
        setJobTitle(data.jobTitle || '');
        setCompany(data.company || '');
        setSource(data.source);
        setStage(data.status);
        setPriority(data.priority);
        setNotes(data.notes || '');

        // Format Date for Input (YYYY-MM-DD)
        if (data.nextFollowUp) {
            const formattedDate = new Date(data.nextFollowUp).toISOString().split('T')[0];
            setFollowUpDate(formattedDate);
        }

        setLoading(false);
    }).catch((error) => {
        setLoading(false);
        alert('Error fetching lead details');
        console.log(error);
    });
  }, [id]);

  const handleUpdateLead = () => {
    if(!name || !email) {
        alert("Please fill in required fields");
        return;
    }

    setLoading(true);
    
    const data = {
      name,
      email,
      phone,
      jobTitle,   
      company,
      source,
      status: stage, 
      priority,
      nextFollowUp: followUpDate || null,
      notes: notes,
    };

    axios
      .put(`https://customer-leads-management.onrender.com/leads/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/'); 
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        alert('Error updating lead');
      });
  };

  const getPriorityStyle = (type) => {
    const isSelected = priority === type;
    if (!isSelected) {
        return {
            borderColor: '#e2e8f0',
            backgroundColor: 'white',
            color: '#64748b',
        };
    }
    switch (type) {
        case 'Hot': return { borderColor: '#ef4444', backgroundColor: '#fee2e2', color: '#ef4444' };
        case 'Warm': return { borderColor: '#f59e0b', backgroundColor: '#fef3c7', color: '#b45309' };
        case 'Cold': return { borderColor: '#3b82f6', backgroundColor: '#eff6ff', color: '#3b82f6' };
        default: return {};
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex justify-center py-10 px-4 font-sans'>
      
      {loading && <Spinner />}

      <Paper 
        elevation={0} 
        sx={{ 
            width: '100%', 
            maxWidth: '1350px', 
            margin:'0 auto',
            padding: 1, px: 0,
        }}
      >
        <div className='flex justify-between items-center p-6 border-b border-slate-100 bg-white'>
            <Typography variant="h5" mb={2} sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                Edit Lead Details
            </Typography> 
        </div>

        <div className='p-8 bg-white'>
            <Grid container spacing={5} mb={6}>
                <Grid item xs={12} md={6}>
                
                {/* Personal Info */}
                <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 600, mb: 3 }}>
                    Personal Information
                </Typography>

                <Grid container spacing={3} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                        <CustomLabel required>Full Name</CustomLabel>
                        <TextField 
                            fullWidth size="small"
                            value={name} onChange={(e) => setName(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <CustomLabel required>Email Address</CustomLabel>
                        <TextField 
                            fullWidth size="small"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomLabel>Phone Number</CustomLabel>
                        <TextField 
                            fullWidth size="small"
                            value={phone} onChange={(e) => setPhone(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>
                </Grid>

                {/* Company Info */}
                <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 600, mb: 3 }}>
                    Company Details
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <CustomLabel>Job Title</CustomLabel>
                        <TextField 
                            fullWidth size="small"
                            value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomLabel>Company Name</CustomLabel>
                        <TextField 
                            fullWidth size="small"
                            value={company} onChange={(e) => setCompany(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Grid>
                </Grid>

            </Grid>

            <Grid item xs={12} md={6}>
                
                {/* Classification */}
                <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 600, mb: 3 }}>
                    Lead Classification
                </Typography>

                <Grid container spacing={8}>
                    
                    <Grid item xs={12}>
                        <CustomLabel>Lead Source</CustomLabel>
                        <Select
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            fullWidth size="small" displayEmpty
                            sx={{ borderRadius: '8px' }}
                        >
                            <MenuItem value="Website">Website Form</MenuItem>
                            <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                            <MenuItem value="Referral">Referral</MenuItem>
                            <MenuItem value="Ad Campaign">Ad Campaign</MenuItem>
                        </Select>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomLabel>Current Status</CustomLabel>
                        <Select
                            value={stage}
                            onChange={(e) => setStage(e.target.value)}
                            fullWidth size="small" displayEmpty
                            sx={{ borderRadius: '8px' }}
                        >
                            <MenuItem value="New">New</MenuItem>
                            <MenuItem value="Contacted">Contacted</MenuItem>
                            <MenuItem value="Proposal Sent">Proposal Sent</MenuItem>
                            <MenuItem value="Negotiation">Negotiation</MenuItem>
                            <MenuItem value="Converted">Converted</MenuItem>
                            <MenuItem value="Lost">Lost</MenuItem>
                        </Select>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomLabel>Priority Level</CustomLabel>
                        <div className='flex gap-3'>
                            {['Hot', 'Warm', 'Cold'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setPriority(type)}
                                    style={{
                                        ...getPriorityStyle(type),
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        borderRadius: '20px', 
                                        padding: '6px 24px',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomLabel>Next Follow-up</CustomLabel>
                        <TextField 
                            type="date" 
                            fullWidth size="small" 
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} 
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomLabel>Notes</CustomLabel>
                        <TextField 
                            multiline rows={3} 
                            fullWidth 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} 
                        />
                    </Grid>

                </Grid>

            </Grid>
        </Grid>
        </div>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2}}>
            <Button 
                variant="outlined" 
                sx={{ textTransform: 'none', fontWeight: 'bold', borderColor: '#cbd5e1', color: '#475569' }}
                onClick={() => navigate('/')}
            >
                Cancel
            </Button>
            <Button 
                variant="contained" 
                sx={{ textTransform: 'none', fontWeight: 'bold', backgroundColor: '#3b82f6', boxShadow: 'none' }}
                onClick={handleUpdateLead}
            >
                Update Lead
            </Button>
        </Box>

      </Paper>
    </div>
  );
};

export default EditLead;