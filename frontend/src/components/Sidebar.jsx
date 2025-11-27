import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
    Typography, Box, Divider, Dialog, DialogTitle, DialogContent, 
    DialogActions, Button, IconButton, Paper 
} from '@mui/material';
import { 
    Dashboard as DashboardIcon, 
    AddCircleOutline, 
    SettingsInputComponent, 
    ContentCopy,
    Dns
} from '@mui/icons-material';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openIntegration, setOpenIntegration] = useState(false);
  const webhookUrl = "http://localhost:5555/leads/webhook/capture"; 

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Add Lead', icon: <AddCircleOutline />, path: '/leads/create' },
  ];

  const handleLinkClick = () => {
      if (toggleSidebar) toggleSidebar();
  };

  return (
    <>
      {/* SIDEBAR */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleSidebar} 
        sx={{
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            backgroundColor: '#0f172a',
            color: 'white',
          },
        }}
      >
        {/* Logo Area */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Dns sx={{ color: '#3b82f6', fontSize: 30 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#f8fafc' }}>
                CRM System
            </Typography>
        </Box>
        <Divider sx={{ bgcolor: '#334155' }} />

        {/* Navigation List */}
        <List sx={{ p: 2 }}>
            {menuItems.map((item) => (
                <Link 
                    to={item.path} 
                    key={item.text} 
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    onClick={handleLinkClick} 
                >
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton 
                            selected={location.pathname === item.path}
                            sx={{ 
                                borderRadius: '8px',
                                '&.Mui-selected': { bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } },
                                '&:hover': { bgcolor: '#1e293b' }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                </Link>
            ))}

            {/* SETTINGS */}
            <ListItem disablePadding sx={{ mb: 1, mt: 2 }}>
                <Typography variant="caption" sx={{ ml: 2, mb: 1, color: '#94a3b8', fontWeight: 'bold' }}>SETTINGS</Typography>
            </ListItem>
            
            <ListItem disablePadding>
                <ListItemButton 
                    onClick={() => setOpenIntegration(true)}
                    sx={{ 
                        borderRadius: '8px', 
                        '&:hover': { bgcolor: '#1e293b' } 
                    }}
                >
                    <ListItemIcon sx={{ color: '#94a3b8' }}><SettingsInputComponent /></ListItemIcon>
                    <ListItemText primary="Integrations" sx={{ color: '#94a3b8' }} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                </ListItemButton>
            </ListItem>
        </List>
      </Drawer>

      {/* INTEGRATION DIALOG */}
      <Dialog 
        open={openIntegration} 
        onClose={() => setOpenIntegration(false)}
        PaperProps={{ sx: { borderRadius: '12px', maxWidth: '500px', width: '100%' } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #f1f5f9' }}>
            Integration Setup
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Use this Webhook URL to auto-capture leads from external sources (Facebook Ads, Google Ads, Zapier).
            </Typography>
            
            <Typography variant="caption" fontWeight="bold" color="#64748b">
                YOUR WEBHOOK URL
            </Typography>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 1.5, mt: 1, mb: 3, 
                    bgcolor: '#f8fafc', border: '1px dashed #cbd5e1', 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}
            >
                <code className="text-sm text-slate-700 font-mono break-all">
                    {webhookUrl}
                </code>
                <IconButton size="small" onClick={() => {navigator.clipboard.writeText(webhookUrl); alert("Copied!")}}>
                    <ContentCopy fontSize="small"/>
                </IconButton>
            </Paper>

            <Typography variant="caption" fontWeight="bold" color="#64748b">
                REQUIRED JSON FORMAT
            </Typography>
            <div className="bg-slate-900 text-slate-200 p-3 rounded mt-1 text-xs font-mono">
                <pre>
                    {`{
                    "name": "Client Name",
                    "email": "client@email.com",
                    "source": "Facebook Ads",
                    "phone": "optional"
                    }`}
                </pre>
            </div>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
            <Button onClick={() => setOpenIntegration(false)} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                Close
            </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;