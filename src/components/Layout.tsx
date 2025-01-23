// src/components/Layout.tsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Container } from '@mui/material';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Navbar />
            <Container sx={{ flex: 1, paddingTop: '20px', paddingBottom: '20px' }}>
                {children}
            </Container>
            <Footer />
        </div>
    );
};

export default Layout;