import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, useTheme } from '@mui/material';

const Navbar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Ecom Dashboard
                </Typography>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                    <Button color="inherit" component={Link} to="/customers" sx={{ textTransform: 'none', fontSize: isMobile ? '14px' : '16px' }}>
                        Customers
                    </Button>
                    <Button color="inherit" component={Link} to="/products" sx={{ textTransform: 'none', fontSize: isMobile ? '14px' : '16px' }}>
                        Products
                    </Button>
                    <Button color="inherit" component={Link} to="/dashboard/bills/1" sx={{ textTransform: 'none', fontSize: isMobile ? '14px' : '16px' }}>
                        Bills
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;