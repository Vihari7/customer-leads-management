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
  Chip,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import { 
    Add, Edit, Delete, Visibility, Search, 
    Close as CloseIcon, 
    DeleteOutline as DeleteIcon 
} from '@mui/icons-material';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    axios
      .get('https://customer-leads-management.onrender.com/leads')
      .then((response) => {
        setLeads(response.data.data);
        setFiltered(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  const confirmDelete = () => {
    setLoading(true);
    axios
      .delete(`https://customer-leads-management.onrender.com/leads/${deleteId}`)
      .then(() => {
        setLoading(false);
        handleCloseDialog();
        const updatedLeads = leads.filter((lead) => lead._id !== deleteId);
        setLeads(updatedLeads);
        setFiltered(updatedLeads); 
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check console');
        console.log(error);
      });
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

  // format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  useEffect(() => {
    let data = [...leads];
    if (search.trim() !== '') {
      data = data.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase()) ||
        (l.company && l.company.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (filterStatus !== '') {
      data = data.filter(l => l.status === filterStatus);
    }
    if (filterPriority !== '') {
      data = data.filter(l => l.priority === filterPriority);
    }
    setFiltered(data);
  }, [search, filterStatus, filterPriority, leads]);

  return (
    <div className='p-8 bg-gray-50 min-h-screen font-sans'>
      <h1 className='text-xl font-bold text-slate-800 mb-6'>Dashboard</h1>

      {/* Toolbar */}
      <Paper elevation={0} sx={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
        <div className='flex gap-8 items-center flex-wrap'>
            <TextField 
                placeholder="Search leads..." 
                variant="outlined" 
                size="small" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: (<InputAdornment position="start"><Search className='text-gray-400' /></InputAdornment>)}}
                sx={{ width: '320px', backgroundColor: '#f8fafc', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' } }}}
            />
            <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                displayEmpty
                size="small"
                sx={{ minWidth: '160px', color: filterStatus ? 'black' : '#64748b', '.MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }}}
                renderValue={(selected) => { if (selected.length === 0) return <span>Status</span>; return selected; }}
            >
                <MenuItem value=""><em>All Statuses</em></MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Proposal Sent">Proposal Sent</MenuItem>
                <MenuItem value="Negotiation">Negotiation</MenuItem>
                <MenuItem value="Converted">Converted</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
            </Select>
            <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                displayEmpty
                size="small"
                sx={{ minWidth: '160px', color: filterPriority ? 'black' : '#64748b', '.MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }}}
                renderValue={(selected) => { if (selected.length === 0) return <span>Priority</span>; return selected; }}
            >
                <MenuItem value=""><em>All Priorities</em></MenuItem>
                <MenuItem value="Hot">Hot</MenuItem>
                <MenuItem value="Warm">Warm</MenuItem>
                <MenuItem value="Cold">Cold</MenuItem>
            </Select>
        </div>
        <Link to='/leads/create'>
          <Button variant="contained" startIcon={<Add />} sx={{ backgroundColor: '#2563eb', textTransform: 'none', fontWeight: 'bold', borderRadius: '6px', padding: '8px 20px', ':hover': { backgroundColor: '#1d4ed8' } }}>
            Add Lead
          </Button>
        </Link>
      </Paper>

      {/* Table */}
      {loading && !openDialog ? (
        <Spinner />
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Name & Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Follow Up</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((lead, index) => (
                <TableRow key={lead._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{index + 1}</TableCell>
                  
                  {/* Name & Job Title */}
                  <TableCell>
                    <div className="font-semibold text-slate-700">{lead.name}</div>
                    {lead.jobTitle && (
                        <div className="text-xs text-slate-400">{lead.jobTitle}</div>
                    )}
                  </TableCell>

                  {/* Company */}
                  <TableCell className='text-slate-600'>
                    {lead.company || '-'}
                  </TableCell>

                  {/* Email & Phone */}
                  <TableCell>
                     <div className='text-slate-500 text-sm'>{lead.email}</div>
                     {lead.phone && (
                        <div className='text-slate-400 text-xs mt-0.5'>{lead.phone}</div>
                     )}
                  </TableCell>

                  <TableCell className='text-slate-500'>{lead.source}</TableCell>
                  
                  <TableCell>
                    <Chip label={lead.status} color={getStatusColor(lead.status)} size="small" variant="filled" />
                  </TableCell>
                  
                  <TableCell>
                    <span className={lead.priority === 'Hot' ? 'text-red-600 font-bold bg-red-50 px-2 py-1 rounded' : 'text-slate-500'}>
                      {lead.priority}
                    </span>
                  </TableCell>

                  {/* Next Follow Up */}
                  <TableCell className='text-slate-600 text-sm'>
                    {formatDate(lead.nextFollowUp)}
                  </TableCell>

                  <TableCell align="center">
                    <div className='flex justify-center gap-x-2'>
                      <Link to={`/leads/details/${lead._id}`}>
                        <IconButton size="small" className='text-blue-500'><Visibility fontSize='small'/></IconButton>
                      </Link>
                      <Link to={`/leads/edit/${lead._id}`}>
                        <IconButton size="small" className='text-amber-500'><Edit fontSize='small'/></IconButton>
                      </Link>
                      <IconButton 
                        size="small" 
                        className='text-red-500' 
                        onClick={() => handleDeleteClick(lead._id)}
                      >
                        <Delete fontSize='small'/>
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell align="center" colSpan={9} className='py-8 text-gray-500'>No leads found matching your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '12px',
            maxWidth: '450px',
            width: '100%'
          }
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleCloseDialog} size="small">
                <CloseIcon fontSize='small' className='text-slate-400 hover:text-slate-600'/>
            </IconButton>
        </div>

        <DialogTitle sx={{ 
            textAlign: 'left', 
            fontWeight: 'bold', 
            fontSize: '2rem', 
            fontFamily: 'serif', 
            pt: 0,
            pb: 1
        }}>
          Delete Lead
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#1e293b', mb: 1 }}>
            Are you sure you want to delete this lead?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ padding: '16px 24px', display: 'flex', gap: 2 }}>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ 
                flex: 1, 
                textTransform: 'uppercase', 
                fontWeight: 'bold',
                backgroundColor: '#d32f2f',
                borderRadius: '4px',
                padding: '10px'
            }}
          >
            Yes, Delete It
          </Button>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            sx={{ 
                flex: 1, 
                textTransform: 'uppercase', 
                fontWeight: 'bold',
                borderColor: '#3b82f6',
                color: '#3b82f6',
                borderRadius: '4px',
                padding: '10px'
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default Dashboard;