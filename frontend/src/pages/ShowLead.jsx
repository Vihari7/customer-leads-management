import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { 
    Paper, Typography, Divider, Chip, Grid, Box, Tab, Tabs, 
    List, ListItem, ListItemText, ListItemIcon, TextField, Button, Select, MenuItem 
} from '@mui/material';
import { Phone, Email, Business, Note, Description, Send, Link as LinkIcon } from '@mui/icons-material';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other} className='p-4'>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const ShowLead = () => {
  const [lead, setLead] = useState({});
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { id } = useParams();

  // State for New Log
  const [logType, setLogType] = useState('Call');
  const [logNote, setLogNote] = useState('');

  // State for New Document
  const [docName, setDocName] = useState('');
  const [docLink, setDocLink] = useState('');

  // 1. Helper function to refresh data
  const fetchLead = () => {
    setLoading(true);
    axios.get(`http://localhost:5555/leads/${id}`)
      .then((response) => {
        setLead(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLead();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 2. Function to Add Log
  const handleAddLog = () => {
    if(!logNote) return alert("Please write a note");
    
    axios.post(`http://localhost:5555/leads/${id}/log`, { type: logType, note: logNote })
        .then(() => {
            setLogNote(''); // Clear input
            fetchLead(); // Refresh data
        })
        .catch((err) => alert("Error adding log"));
  };

  // 3. Function to Add Document
  const handleAddDoc = () => {
    if(!docName || !docLink) return alert("Please fill both fields");

    axios.post(`http://localhost:5555/leads/${id}/document`, { name: docName, link: docLink })
        .then(() => {
            setDocName('');
            setDocLink('');
            fetchLead();
        })
        .catch((err) => alert("Error adding document"));
  };

  if (loading) return <Spinner />;

  return (
    <div className='p-4 bg-gray-50 min-h-screen'>
      <BackButton />
      
      <div className='max-w-4xl mx-auto mt-4'>
        <Paper elevation={2} className='p-6 mb-6 flex justify-between items-center border-l-8 border-blue-600'>
            <div>
                <Typography variant="h4" className='font-bold'>{lead.name}</Typography>
                <div className='flex items-center gap-2 text-gray-600 mt-1'>
                    <Business fontSize="small" />
                    <Typography variant="subtitle1">{lead.company || "No Company Info"}</Typography>
                </div>
            </div>
            <div className='flex flex-col items-end gap-2'>
                <Chip label={lead.status} color="primary" />
                <Typography variant="caption" className='text-gray-400'>ID: {lead._id}</Typography>
            </div>
        </Paper>

        <Paper elevation={3}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Overview" />
                    <Tab label="Communication Log" />
                    <Tab label="Documents" />
                </Tabs>
            </Box>

            {/* TAB 0: OVERVIEW */}
            <CustomTabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                        <div className='flex items-center gap-2'><Email fontSize="small" className='text-blue-500'/><Typography>{lead.email}</Typography></div>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                        <div className='flex items-center gap-2'><Phone fontSize="small" className='text-green-500'/><Typography>{lead.phone || "N/A"}</Typography></div>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Source</Typography>
                        <Typography>{lead.source}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Priority</Typography>
                        <Typography className={lead.priority === 'Hot' ? 'text-red-600 font-bold' : ''}>{lead.priority}</Typography>
                    </Grid>
                </Grid>
            </CustomTabPanel>

            {/* TAB 1: COMMUNICATION LOG (Dynamic) */}
            <CustomTabPanel value={tabValue} index={1}>
                
                {/* Form to Add Note */}
                <Box className='mb-4 p-4 bg-gray-50 rounded-lg border'>
                    <Typography variant="subtitle2" className='mb-2'>Add New Note</Typography>
                    <div className='flex gap-2'>
                        <Select size="small" value={logType} onChange={(e) => setLogType(e.target.value)}>
                            <MenuItem value="Call">Call</MenuItem>
                            <MenuItem value="Email">Email</MenuItem>
                            <MenuItem value="Meeting">Meeting</MenuItem>
                        </Select>
                        <TextField 
                            fullWidth size="small" placeholder="Describe what happened..." 
                            value={logNote} onChange={(e) => setLogNote(e.target.value)}
                        />
                        <Button variant="contained" onClick={handleAddLog} endIcon={<Send />}>Add</Button>
                    </div>
                </Box>

                <Divider />

                {/* List of Logs */}
                <List className='max-h-60 overflow-y-auto'>
                    {lead.communicationLog && lead.communicationLog.length > 0 ? (
                        lead.communicationLog.slice().reverse().map((log, i) => ( // Reverse to show newest first
                            <ListItem key={i} divider>
                                <ListItemIcon><Note /></ListItemIcon>
                                <ListItemText 
                                    primary={<span className='font-semibold'>{log.type}</span>}
                                    secondary={
                                        <>
                                            <span className='block text-gray-800'>{log.note}</span>
                                            <span className='text-xs text-gray-400'>{new Date(log.date).toLocaleString()}</span>
                                        </>
                                    } 
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography className='text-gray-400 italic p-4'>No logs yet.</Typography>
                    )}
                </List>
            </CustomTabPanel>

            {/* TAB 2: DOCUMENTS (Dynamic Links) */}
            <CustomTabPanel value={tabValue} index={2}>
                 {/* Form to Add Document */}
                 <Box className='mb-4 p-4 bg-gray-50 rounded-lg border'>
                    <Typography variant="subtitle2" className='mb-2'>Attach Document Link</Typography>
                    <div className='flex gap-2'>
                        <TextField 
                            size="small" label="File Name" 
                            value={docName} onChange={(e) => setDocName(e.target.value)}
                        />
                        <TextField 
                            fullWidth size="small" label="Link (Google Drive/Dropbox)" 
                            value={docLink} onChange={(e) => setDocLink(e.target.value)}
                        />
                        <Button variant="contained" onClick={handleAddDoc}>Add</Button>
                    </div>
                </Box>

                <List>
                    {lead.attachedDocuments && lead.attachedDocuments.length > 0 ? (
                        lead.attachedDocuments.map((doc, i) => (
                            <ListItem key={i} divider component="a" href={doc.link} target="_blank">
                                <ListItemIcon><Description color="primary"/></ListItemIcon>
                                <ListItemText 
                                    primary={doc.name} 
                                    secondary={<span className='text-blue-500 text-xs flex items-center gap-1'><LinkIcon fontSize="inherit"/> {doc.link}</span>} 
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography className='text-gray-400 italic p-4'>No documents attached.</Typography>
                    )}
                </List>
            </CustomTabPanel>

        </Paper>
      </div>
    </div>
  );
};

export default ShowLead;