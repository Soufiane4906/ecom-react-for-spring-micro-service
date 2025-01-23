// src/components/Dashboard/Dashboard.tsx
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import './Dashboard.css'; // Importez le fichier CSS

const Dashboard: React.FC = () => {
    const [isAdmin, setIsAdmin] = React.useState(false);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            setIsAdmin(decodedToken.email === 'anibasoufiane2001@gmail.com');
        }
    }, []);

    return (
        <Box className="dashboard">
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            {isAdmin ? (
                <Grid container spacing={3} className="stats-grid">
                    {[
                        { title: 'Total Customers', value: '1,234', color: '#4caf50' },
                        { title: 'Total Products', value: '567', color: '#2196f3' },
                        { title: 'Total Sales', value: '$89,000', color: '#fbc02d' },
                        { title: 'Pending Orders', value: '12', color: '#d32f2f' },
                    ].map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper className="stat-card" style={{ backgroundColor: stat.color }}>
                                <Typography variant="h6">{stat.title}</Typography>
                                <Typography variant="h4">{stat.value}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper className="about-app">
                    <Typography variant="h5" gutterBottom>
                        About the App
                    </Typography>
                    <Typography variant="body1">
                        Welcome to the Ecom Dashboard! This application allows you to manage customers, products, and bills efficiently. If you have any questions, please contact support.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default Dashboard;