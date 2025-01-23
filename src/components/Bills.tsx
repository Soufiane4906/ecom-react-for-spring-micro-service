import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, CircularProgress, IconButton
} from '@mui/material';
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";

const Bills: React.FC = () => {
    const [bills, setBills] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentBill, setCurrentBill] = useState({ id: null, customerId: '', createdAt: '' });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (customerId) {
            fetchBills();
        }
    }, [customerId]);

    const fetchBills = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/BILLING-SERVICE/bills/search/billsByCustomerId?projection=billProj1&id=${customerId}`);
            setBills(response.data._embedded.bills);
        } catch (error) {
            setErrorMessage('Failed to fetch bills');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (bill = { id: null, customerId: '', createdAt: '' }) => {
        setCurrentBill(bill);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentBill({ id: null, customerId: '', createdAt: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentBill({ ...currentBill, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (currentBill.id) {
                await axios.put(`http://localhost:8080/BILLING-SERVICE/bills/${currentBill.id}`, currentBill);
            } else {
                await axios.post("http://localhost:8080/BILLING-SERVICE/bills", currentBill);
            }
            fetchBills();
            handleCloseDialog();
        } catch (error) {
            setErrorMessage(currentBill.id ? 'Update failed' : 'Creation failed');
        }
    };

    const handleDeleteBill = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/BILLING-SERVICE/bills/${id}`);
            fetchBills();
        } catch (error) {
            setErrorMessage('Failed to delete bill');
        }
    };

    const handleBillDetails = (id: number) => {
        navigate(`/bill-details/${id}`);
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Bills for Customer ID: {customerId}
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2, borderRadius: '8px', textTransform: 'none' }}
            >
                Add Bill
            </Button>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress size={40} />
                </Box>
            ) : (
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
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpenDialog(bill)}
                                            sx={{ '&:hover': { bgcolor: '#e3f2fd' } }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteBill(bill.id)}
                                            sx={{ '&:hover': { bgcolor: '#ffebee' }, ml: 1 }}
                                        >
                                            <Delete />
                                        </IconButton>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleBillDetails(bill.id)}
                                            sx={{ ml: 2, textTransform: 'none' }}
                                        >
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>
                    {currentBill.id ? 'Edit Bill' : 'Add Bill'}
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Customer ID"
                            name="customerId"
                            value={currentBill.customerId}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Date"
                            name="createdAt"
                            type="date"
                            value={currentBill.createdAt}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        color="secondary"
                        sx={{ borderRadius: '6px', px: 3, textTransform: 'none', border: '1px solid #1976d2', color: '#1976d2' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        sx={{ borderRadius: '6px', px: 3, textTransform: 'none', bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                    >
                        {currentBill.id ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="error" sx={{ bgcolor: '#fff', color: '#d32f2f', boxShadow: '0 3px 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Bills;