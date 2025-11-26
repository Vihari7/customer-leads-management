import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { 
    Typography, Paper, Box, Chip, Button, Divider,
    Tabs, Tab, List, ListItem, ListItemText, ListItemIcon,
    TextField, Select, MenuItem, Avatar, Stack, Card, CardContent,
    Container, Grid, IconButton
} from '@mui/material';
import { 
    ArrowBack, Email, Phone, Business, Work, 
    Flag, Source, NoteAdd, Description, 
    Link as LinkIcon, Person, Download, CalendarMonth,
    Edit, DeleteOutline
} from '@mui/icons-material';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'white', border: '1px solid #e2e8f0', borderTop: 0, borderRadius: '0 0 12px 12px', minHeight: '400px' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ShowLead = () => {
  const [lead, setLead] = useState({});
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { id } = useParams();

  // Inputs
  const [logType, setLogType] = useState('Email');
  const [logNote, setLogNote] = useState('');
  const [docName, setDocName] = useState('');
  const [docLink, setDocLink] = useState('');
  
  // Scheduler Inputs
  const [taskNote, setTaskNote] = useState('');
  const [taskDate, setTaskDate] = useState('');

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
  }, [id]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const latestTaskLog = lead.communicationLog?.slice().reverse().find(log => log.type === 'Task Set');
  const upcomingTaskDisplay = taskNote || (latestTaskLog ? latestTaskLog.note.split(' for 20')[0] : 'Scheduled Interaction');

  const handleAddLog = () => {
    if(!logNote) return alert("Please write a note");
    axios.post(`http://localhost:5555/leads/${id}/log`, { type: logType, note: logNote })
      .then(() => { setLogNote(''); fetchLead(); })
      .catch(() => alert("Error adding log"));
  };

  const handleDeleteLog = (logId) => {
    if(!window.confirm("Are you sure you want to delete this log?")) return;
    const updatedLogs = lead.communicationLog.filter(log => log._id !== logId);
    const updatedLeadData = { ...lead, communicationLog: updatedLogs };
    axios.put(`http://localhost:5555/leads/${id}`, updatedLeadData)
        .then(() => fetchLead())
        .catch((error) => alert("Error deleting log"));
  };

  const handleAddDoc = () => {
    if(!docName || !docLink) return alert("Please fill both fields");
    axios.post(`http://localhost:5555/leads/${id}/document`, { name: docName, link: docLink })
      .then(() => { setDocName(''); setDocLink(''); fetchLead(); })
      .catch(() => alert("Error adding document"));
  };

  const handleDeleteDoc = (docId) => {
    if(!window.confirm("Are you sure you want to delete this document?")) return;
    const updatedDocs = lead.attachedDocuments.filter(doc => doc._id !== docId);
    const updatedLeadData = { ...lead, attachedDocuments: updatedDocs };
    axios.put(`http://localhost:5555/leads/${id}`, updatedLeadData)
        .then(() => fetchLead())
        .catch((error) => alert("Error deleting document"));
  };

  const handleSetReminder = () => {
    if(!taskDate) return alert("Please select a date");
    if(!taskNote) return alert("Please enter a task description"); 

    axios.put(`http://localhost:5555/leads/${id}`, { ...lead, nextFollowUp: taskDate })
    .then(() => {
        // Save the task description into the log
        return axios.post(`http://localhost:5555/leads/${id}/log`, { 
            type: 'Task Set', 
            note: `${taskNote} for ${taskDate}` 
        });
    }).then(() => {
        setTaskNote(''); 
        setTaskDate(''); 
        fetchLead(); 
        alert("Reminder Set!");
    }).catch((err) => console.log(err));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'info';
      case 'Contacted': return 'warning';
      case 'Proposal Sent': return 'secondary';
      case 'Negotiation': return 'primary';
      case 'Converted': return 'success';
      case 'Lost': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) return <Spinner />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>

        {/* --- PROFILE HEADER --- */}
        <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', mb: 4, overflow: 'visible' }}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-start' }} spacing={3}>
                    
                    {/* Identity Section */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" sx={{ width: '100%' }}>
                        <Avatar 
                            sx={{ 
                                width: 88, height: 88, 
                                bgcolor: '#eff6ff', color: '#2563eb', 
                                fontSize: '2.5rem', fontWeight: 'bold',
                                border: '1px solid #bfdbfe'
                            }}
                        >
                            {lead.name ? lead.name.charAt(0).toUpperCase() : <Person />}
                        </Avatar>
                        
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, width: '100%' }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                                {lead.name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }} sx={{ color: '#64748b' }}>
                                <Work fontSize="small" sx={{ fontSize: 18 }} />
                                <Typography variant="body1" fontWeight="500">
                                    {lead.jobTitle || 'No Job Title'}
                                </Typography>
                                <Typography sx={{ mx: 1, color: '#cbd5e1' }}>|</Typography>
                                <Business fontSize="small" sx={{ fontSize: 18 }} />
                                <Typography variant="body1" fontWeight="500">
                                    {lead.company || 'No Company'}
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>

                    {/* Actions & Status Section */}
                    <Stack direction="column" alignItems={{ xs: 'stretch', md: 'flex-end' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                         <Link to={`/leads/edit/${lead._id}`} style={{ textDecoration: 'none' }}>
                            <Button fullWidth variant="outlined" startIcon={<Edit />} size="small" sx={{ borderRadius: '8px', textTransform: 'none', borderColor: '#cbd5e1', color: '#475569' }}>
                                Edit Profile
                            </Button>
                         </Link>
                         
                         <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                            <Chip 
                                label={lead.priority} 
                                icon={<Flag style={{ fontSize: 16 }} />}
                                size="small"
                                sx={{ 
                                    fontWeight: 'bold', 
                                    bgcolor: lead.priority === 'Hot' ? '#fee2e2' : '#f1f5f9',
                                    color: lead.priority === 'Hot' ? '#ef4444' : '#64748b',
                                    border: '1px solid',
                                    borderColor: lead.priority === 'Hot' ? '#fecaca' : '#e2e8f0'
                                }} 
                            />
                            <Chip 
                                label={lead.status} 
                                color={getStatusColor(lead.status)} 
                                size="small"
                                sx={{ fontWeight: 'bold', borderRadius: '6px' }}
                            />
                         </Stack>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 3, borderColor: '#f1f5f9' }} />

                {/* Contacts */}
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    divider={<Divider orientation="vertical" flexItem sx={{ borderColor: '#e2e8f0', display: { xs: 'none', sm: 'block' } }} />}
                    spacing={{ xs: 2, sm: 4 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Email sx={{ color: '#94a3b8', fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" display="block" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Email</Typography>
                            <Typography variant="body2" fontWeight="600" color="#334155" sx={{ wordBreak: 'break-all' }}>{lead.email}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Phone sx={{ color: '#94a3b8', fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" display="block" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Phone</Typography>
                            <Typography variant="body2" fontWeight="600" color="#334155">{lead.phone || 'N/A'}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Source sx={{ color: '#94a3b8', fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" display="block" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Source</Typography>
                            <Typography variant="body2" fontWeight="600" color="#334155">{lead.source}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CalendarMonth sx={{ color: '#3b82f6', fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" display="block" sx={{ color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase' }}>Next Follow Up</Typography>
                            <Typography variant="body2" fontWeight="700" color="#1e293b">{formatDate(lead.nextFollowUp)}</Typography>
                        </Box>
                    </Box>
                </Stack>

            </CardContent>
        </Card>

        {/* TABS */}
        <Box>
            <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{ 
                    '& .MuiTabs-indicator': { display: 'none' }, 
                    minHeight: '48px',
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 'bold',
                        color: '#64748b',
                        mr: 0.5,
                        borderRadius: '8px 8px 0 0',
                        border: '1px solid transparent',
                        '&.Mui-selected': {
                            color: '#0f172a',
                            bgcolor: 'white',
                            borderColor: '#e2e8f0',
                            borderBottomColor: 'white'
                        }
                    }
                }}
            >
                <Tab label="Overview" disableRipple />
                <Tab label={`Activity Log (${lead.communicationLog?.length || 0})`} disableRipple />
                <Tab label={`Documents (${lead.attachedDocuments?.length || 0})`} disableRipple />
                <Tab label="Follow-up Tasks" disableRipple />
            </Tabs>

            {/* OVERVIEW */}
            <CustomTabPanel value={tabValue} index={0}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, color: '#334155', mb: 2 }}>
                            Initial Lead Notes
                        </Typography>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 2, minHeight: '160px' }}>
                            <Typography variant="body2" sx={{ color: '#451a03', lineHeight: 1.6 }}>
                                {lead.notes ? lead.notes : <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>No notes added.</span>}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, color: '#334155', mb: 2 }}>
                            Classification
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: lead.priority === 'Hot' ? '#fee2e2' : '#e0f2fe', color: lead.priority === 'Hot' ? '#ef4444' : '#0ea5e9' }}>
                                        <Flag fontSize="small"/>
                                    </Box>
                                    <Typography variant="body2" fontWeight="bold" color="#64748b" textTransform="uppercase">Priority Level : </Typography>
                                </Stack>
                                <Typography variant="body1" fontWeight="bold" color={lead.priority === 'Hot' ? '#ef4444' : '#334155'} sx={{ pl: 2 }}>
                                    {lead.priority}
                                </Typography>
                            </Box>

                            <Box sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: '#f3e8ff', color: '#a855f7' }}>
                                        <Work fontSize="small"/>
                                    </Box>
                                    <Typography variant="body2" fontWeight="bold" color="#64748b" textTransform="uppercase">Current Role : </Typography>
                                </Stack>
                                <Typography variant="body1" fontWeight="bold" color="#334155" sx={{ pl: 2 }}>
                                    {lead.jobTitle || 'N/A'}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </CustomTabPanel>

            {/* LOGS */}
            <CustomTabPanel value={tabValue} index={1}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
                     <Select size="small" value={logType} onChange={(e) => setLogType(e.target.value)} sx={{ minWidth: 120 }}>
                        <MenuItem value="Email">Email</MenuItem>
                        <MenuItem value="Call">Call</MenuItem>
                        <MenuItem value="Meeting">Meeting</MenuItem>
                    </Select>
                    <TextField fullWidth size="small" placeholder="Add a note..." value={logNote} onChange={(e) => setLogNote(e.target.value)} />
                    <Button variant="contained" onClick={handleAddLog} sx={{ textTransform: 'none' }}>Add</Button>
                </Stack>
                <List>
                    {lead.communicationLog?.slice().reverse().map((log, i) => (
                        <ListItem 
                            key={log._id || i} 
                            sx={{ border: '1px solid #f1f5f9', borderRadius: 2, mb: 1.5, bgcolor: 'white' }}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteLog(log._id)}>
                                  <DeleteOutline fontSize="small" color="action" />
                                </IconButton>
                            }
                        >
                            <ListItemIcon>
                                <Box p={1} bgcolor="#f1f5f9" borderRadius="50%"><NoteAdd fontSize="small" sx={{ color: '#64748b' }} /></Box>
                            </ListItemIcon>
                            <ListItemText 
                                primary={<Typography fontWeight="600" fontSize="0.9rem">{log.type}</Typography>}
                                secondary={<Typography variant="body2" color="textSecondary">{log.note} • {new Date(log.date).toLocaleDateString()}</Typography>}
                            />
                        </ListItem>
                    ))}
                </List>
            </CustomTabPanel>

            {/* DOCUMENTS */}
            <CustomTabPanel value={tabValue} index={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
                    <TextField size="small" label="Name" value={docName} onChange={(e) => setDocName(e.target.value)} />
                    <TextField fullWidth size="small" label="Link" value={docLink} onChange={(e) => setDocLink(e.target.value)} />
                    <Button variant="contained" onClick={handleAddDoc} sx={{ textTransform: 'none' }}>Add</Button>
                </Stack>
                <List>
                    {lead.attachedDocuments?.map((doc, i) => (
                         <ListItem 
                            key={doc._id || i} 
                            sx={{ border: '1px solid #f1f5f9', borderRadius: 2, mb: 1.5, '&:hover': { bgcolor: '#f8fafc' } }}
                            secondaryAction={
                                <Stack direction="row" spacing={1}>
                                    <IconButton edge="end" component="a" href={doc.link} target="_blank" size="small">
                                        <Download fontSize="small" color="action" />
                                    </IconButton>
                                    <IconButton edge="end" onClick={() => handleDeleteDoc(doc._id)} size="small">
                                        <DeleteOutline fontSize="small" color="error" />
                                    </IconButton>
                                </Stack>
                            }
                         >
                             <ListItemIcon><Description color="error" /></ListItemIcon>
                             <ListItemText 
                                primary={doc.name} 
                                secondary={
                                    <Typography component="a" href={doc.link} target="_blank" variant="caption" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                        {doc.link}
                                    </Typography>
                                } 
                             />
                         </ListItem>
                    ))}
                </List>
            </CustomTabPanel>

            {/* SCHEDULER */}
            <CustomTabPanel value={tabValue} index={3}>
                <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <Typography fontWeight="bold" color="primary" mb={2}>Schedule Follow-up</Typography>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
                        <TextField fullWidth size="small" placeholder="Task description..." value={taskNote} onChange={(e) => setTaskNote(e.target.value)} />
                        <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            style={{ padding: '8.5px', borderRadius: '4px', border: '1px solid #c4c4c4', fontFamily: 'inherit' }} 
                            value={taskDate} 
                            onChange={(e) => setTaskDate(e.target.value)} 
                        />
                        <Button 
                            variant="contained" 
                            onClick={handleSetReminder} 
                            sx={{ textTransform: 'none', whiteSpace: 'nowrap', minWidth: '180px' }}
                        >
                            Set Reminder
                        </Button>
                    </Stack>
                    
                    <Typography variant="caption" fontWeight="bold" color="textSecondary" display="block" mb={1}>UPCOMING</Typography>
                    {lead.nextFollowUp ? (
                        <Box sx={{ p: 2, bgcolor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 2, display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                            <Typography fontWeight="500" color="#0369a1">{upcomingTaskDisplay}</Typography>
                            <Typography fontWeight="bold" color="#0284c7">{formatDate(lead.nextFollowUp)}</Typography>
                        </Box>
                    ) : <Typography fontStyle="italic" color="textSecondary">No tasks scheduled.</Typography>}
                </Box>
            </CustomTabPanel>

        </Box>
      </Container>
    </Box>
  );
};

export default ShowLead;