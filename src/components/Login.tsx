// src/components/Login.tsx
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = (response: any) => {
        console.log('Login Success:', response);
        localStorage.setItem('token', response.credential);
        navigate('/dashboard');
    };

    const handleError = () => {
        console.log('Login Failed');
    };

    return (
        <GoogleOAuthProvider clientId="474919100100-rprp72lb5i7vsbss6vhbo094ikpo6fqk.apps.googleusercontent.com">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
                <Paper sx={{ padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center' }}>
                        Login to Ecom Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                        />
                    </Box>
                </Paper>
            </Box>
        </GoogleOAuthProvider>
    );
};

export default Login;