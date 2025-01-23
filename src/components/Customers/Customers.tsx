// src/components/Customers.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    TextField, Box, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
    Typography, Pagination, Snackbar, Alert, CircularProgress
} from '@mui/material';
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { jwtDecode } from 'jwt-decode'; // Pour décoder le token JWT
const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState({ id: null, name: '', email: '' });
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    // Vérifier si l'utilisateur est un administrateur
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            setIsAdmin(decodedToken.email === 'anibasoufiane2001@gmail.com');
        }
    }, []);

    // Fetch customers with pagination
    useEffect(() => {
        fetchCustomers();
    }, [currentPage]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/CUSTOMER-SERVICE/customers?projection=customerProj1&page=${currentPage - 1}&size=${itemsPerPage}`
            );
            setCustomers(response.data._embedded.customers);
            setTotalPages(response.data.page.totalPages);
        } catch (error) {
            setErrorMessage('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    // Handle opening the dialog for adding/editing a customer
    const handleOpenDialog = (customer = { id: null, name: '', email: '' }) => {
        setCurrentCustomer(customer); // Pré-remplit les champs du formulaire
        setOpenDialog(true); // Ouvre la boîte de dialogue
    };
// Handle opening the dialog for adding/editing a customer

// Handle navigating to the bills page
    const handleGetBills = (id: number) => {
        navigate(`/dashboard/bills/${id}`); // Redirige vers la page des factures du client
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            setErrorMessage('Please enter a search keyword');
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:8080/CUSTOMER-SERVICE/customers/search/findByNameOrEmail?keyword=${searchKeyword}`
            );
            setCustomers(response.data._embedded.customers); // Mettre à jour la liste des clients
            setCurrentPage(1); // Réinitialiser la pagination
        } catch (error) {
            setErrorMessage('Search failed');
        }
    };

    // Handle deleting a customer
    const handleDeleteCustomer = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/CUSTOMER-SERVICE/customers/${id}`);
            fetchCustomers(); // Recharge la liste des clients après suppression
        } catch (error) {
            setErrorMessage('Failed to delete customer');
        }
    };

    // Enhanced form validation
    const validateForm = () => {
        let isValid = true;
        if (!currentCustomer.name.trim()) {
            setNameError('Name is required');
            isValid = false;
        }
        if (!/^\S+@\S+\.\S+$/.test(currentCustomer.email)) {
            setEmailError('Invalid email format');
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = async () => {
        setNameError('');
        setEmailError('');

        if (!validateForm()) return;

        try {
            if (currentCustomer.id) {
                await axios.put(
                    `http://localhost:8080/CUSTOMER-SERVICE/customers/${currentCustomer.id}`,
                    currentCustomer
                );
            } else {
                await axios.post(
                    "http://localhost:8080/CUSTOMER-SERVICE/customers",
                    currentCustomer
                );
            }
            fetchCustomers();
            handleCloseDialog();
        } catch (error) {
            setErrorMessage(currentCustomer.id ? 'Update failed' : 'Creation failed');
        }
    };

    // Handle closing the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentCustomer({ id: null, name: '', email: '' }); // Réinitialise les champs du formulaire
    };

    // Pagination controls
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentCustomer({ ...currentCustomer, [name]: value }); // Met à jour le champ correspondant
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Customer Management
                </Typography>
                {isAdmin && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDialog()}
                        sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                        Add Customer
                    </Button>
                )}
            </Box>

            {/* Search Bar with Enhanced Design */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 4,
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <TextField
                    label="Search customers..."
                    variant="outlined"
                    fullWidth
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: 'white'
                        }
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 4,
                        bgcolor: '#1976d2',
                        '&:hover': { bgcolor: '#1565c0' }
                    }}
                >
                    Search
                </Button>
            </Box>

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress size={40} />
                </Box>
            )}

            {/* Customers Table with Enhanced Design */}
            {!loading && (
                <TableContainer component={Paper} sx={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: '#1976d2' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>ID</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Email</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    sx={{
                                        '&:nth-of-type(odd)': { bgcolor: '#fafafa' },
                                        '&:hover': { bgcolor: '#f0f0f0' },
                                        transition: 'background-color 0.3s'
                                    }}
                                >
                                    <TableCell>{customer.id}</TableCell>
                                    <TableCell sx={{ fontWeight: '500' }}>{customer.name}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>
                                        {isAdmin && (
                                            <>
                                                <IconButton color="primary" onClick={() => handleOpenDialog(customer)}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleDeleteCustomer(customer.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </>
                                        )}
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleGetBills(customer.id)}
                                        >
                                            View Bills
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                        '& .MuiPaginationItem-root': {
                            borderRadius: '6px',
                            '&.Mui-selected': {
                                bgcolor: '#1976d2',
                                color: 'white'
                            }
                        }
                    }}
                />
            </Box>

            {/* Add/Edit Dialog with Validation */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>
                    {currentCustomer.id ? 'Edit Customer' : 'New Customer'}
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Full Name"
                            name="name"
                            value={currentCustomer.name}
                            onChange={handleInputChange}
                            error={!!nameError}
                            helperText={nameError}
                            fullWidth
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    '& fieldset': { borderColor: '#bdbdbd' }
                                }
                            }}
                        />
                        <TextField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={currentCustomer.email}
                            onChange={handleInputChange}
                            error={!!emailError}
                            helperText={emailError}
                            fullWidth
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    '& fieldset': { borderColor: '#bdbdbd' }
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        color="secondary"
                        sx={{
                            borderRadius: '6px',
                            px: 3,
                            textTransform: 'none',
                            border: '1px solid #1976d2',
                            color: '#1976d2'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        sx={{
                            borderRadius: '6px',
                            px: 3,
                            textTransform: 'none',
                            bgcolor: '#1976d2',
                            '&:hover': { bgcolor: '#1565c0' }
                        }}
                    >
                        {currentCustomer.id ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error Handling */}
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity="error"
                    sx={{
                        bgcolor: '#fff',
                        color: '#d32f2f',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                        borderRadius: '8px'
                    }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Customers;