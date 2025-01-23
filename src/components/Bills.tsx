import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';

const Bills: React.FC = () => {
    const [bills, setBills] = useState<any[]>([]);
    const { customerId } = useParams<{ customerId: string }>(); // Get customerId from URL
    const navigate = useNavigate();

    useEffect(() => {
        if (customerId) {
            axios.get(`http://localhost:8080/BILLING-SERVICE/bills/search/billsByCustomerId?projection=billProj1&id=${customerId}`)
                .then(response => {
                    console.log("API Response:", response.data); // Log the API response
                    setBills(response.data._embedded.bills);
                })
                .catch(error => console.error("API Error:", error)); // Log any errors
        }
    }, [customerId]);

    const handleBillDetails = (id: number) => {
        navigate(`/bill-details/${id}`);
    };

    if (bills.length === 0) {
        return (
            <Box sx={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h6">No bills found for customer ID: {customerId}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Bills for Customer ID: {customerId}
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1976d2' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Customer ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bills.map(bill => (
                            <TableRow key={bill.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                <TableCell>{bill.id}</TableCell>
                                <TableCell>{bill.createdAt}</TableCell>
                                <TableCell>{bill.customerId}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleBillDetails(bill.id)} sx={{ textTransform: 'none' }}>
                                        Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Bills;