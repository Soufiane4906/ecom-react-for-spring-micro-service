// src/components/Footer.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box sx={{ backgroundColor: '#1976d2', color: '#fff', padding: '20px', textAlign: 'center', mt: 'auto' }}>
            <Typography variant="body1">
                &copy; {new Date().getFullYear()} Ecom Dashboard. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;