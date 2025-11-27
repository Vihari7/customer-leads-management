import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f8fafc' }}>
      
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>
        <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleSidebar}
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                Leads Management
            </Typography>
        </Toolbar>
      </AppBar>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <Box 
        component="main" 
        sx={{ 
            flexGrow: 1,      
            overflow: 'auto', 
            p: 3             
        }}
      >
        {children}
      </Box>

    </Box>
  );
};

export default Layout;