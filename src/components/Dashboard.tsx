// src/components/Dashboard.tsx
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const Dashboard: React.FC = () => {
    const [isAdmin, setIsAdmin] = React.useState(false);

    // Vérifier si l'utilisateur est un administrateur
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            setIsAdmin(decodedToken.email === 'anibasoufiane2001@gmail.com');
        }
    }, []);

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Dashboard
            </Typography>

            {isAdmin ? (
                // Statistiques pour les administrateurs
                <Grid container spacing={3}>
                    {[
                        { title: 'Total Customers', value: '1,234', color: '#4caf50' },
                        { title: 'Total Products', value: '567', color: '#2196f3' },
                        { title: 'Total Sales', value: '$89,000', color: '#fbc02d' },
                        { title: 'Pending Orders', value: '12', color: '#d32f2f' },
                    ].map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper sx={{ padding: '20px', backgroundColor: stat.color, color: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{stat.title}</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stat.value}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                // Informations sur l'application pour les utilisateurs normaux
                <Paper sx={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        About the App
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}>
                        Welcome to the Ecom Dashboard! This application allows you to manage customers, products, and bills efficiently. If you have any questions, please contact support.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default Dashboard;