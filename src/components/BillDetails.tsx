import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
    Box
} from '@mui/material';
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BillDetails: React.FC = () => {
    const [bill, setBill] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ id: null, productId: '', quantity: 0, price: 0 });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        fetchBill();
    }, [id]);

    const fetchBill = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/BILLING-SERVICE/fullBill/${id}`);
            setBill(response.data);
        } catch (error) {
            setErrorMessage('Failed to fetch bill details');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (product = { id: null, productId: '', quantity: 0, price: 0 }) => {
        setCurrentProduct(product);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentProduct({ id: null, productId: '', quantity: 0, price: 0 });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentProduct({ ...currentProduct, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (currentProduct.id) {
                await axios.put(`http://localhost:8080/BILLING-SERVICE/productItems/${currentProduct.id}`, currentProduct);
            } else {
                await axios.post("http://localhost:8080/BILLING-SERVICE/productItems", { ...currentProduct, billId: id });
            }
            fetchBill();
            handleCloseDialog();
        } catch (error) {
            setErrorMessage(currentProduct.id ? 'Update failed' : 'Creation failed');
        }
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/BILLING-SERVICE/productItems/${id}`);
            fetchBill();
        } catch (error) {
            setErrorMessage('Failed to delete product');
        }
    };

    const handleExportPDF = (bill: any) => {
        const doc = new jsPDF();
        doc.text(`Bill Details - Bill ID: ${bill.id}`, 10, 10);
        doc.autoTable({
            startY: 20,
            head: [['Product ID', 'Product Name', 'Price', 'Quantity', 'Amount']],
            body: bill.productItems.map((item: any) => [
                item.product.id,
                item.product.name,
                item.price.toFixed(2),
                item.quantity,
                item.amount.toFixed(2),
            ]),
        });
        doc.save(`bill-${bill.id}.pdf`);
    };

    if (!bill) return <div>Loading...</div>;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto',
            }}
        >
            <Card sx={{ width: '100%', mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Bill number: {id}</Typography>
                    <Typography>Bill ID: {bill.id}</Typography>
                    <Typography>Bill Date: {new Date(bill.createdAt).toLocaleDateString()}</Typography>
                    <Typography>Customer ID: {bill.customer.id}</Typography>
                    <Typography>Customer Name: {bill.customer.name}</Typography>
                    <Typography>Customer Email: {bill.customer.email}</Typography>
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {/*<Button*/}
                {/*    variant="contained"*/}
                {/*    color="primary"*/}
                {/*    onClick={() => handleOpenDialog()}*/}
                {/*    sx={{ borderRadius: '8px', textTransform: 'none' }}*/}
                {/*>*/}
                {/*    Add Product*/}
                {/*</Button>*/}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleExportPDF(bill)}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                    Export to PDF
                </Button>
                <CSVLink
                    data={bill.productItems.map((item: any) => ({
                        'Product ID': item.product.id,
                        'Product Name': item.product.name,
                        'Price': item.price.toFixed(2),
                        'Quantity': item.quantity,
                        'Amount': item.amount.toFixed(2),
                    }))}
                    filename={"bill-details.csv"}
                    style={{ textDecoration: 'none' }}
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                        Export to CSV
                    </Button>
                </CSVLink>
            </Box>

            <TableContainer component={Paper} sx={{ width: '100%', mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product ID</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bill.productItems.map((item: any) => (
                            <TableRow key={item.product.id}>
                                <TableCell>{item.product.id}</TableCell>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell>{item.price.toFixed(2)}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(item)}
                                        sx={{ '&:hover': { bgcolor: '#e3f2fd' } }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteProduct(item.id)}
                                        sx={{ '&:hover': { bgcolor: '#ffebee' }, ml: 1 }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={4}>Total</TableCell>
                            <TableCell>{bill.total.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog et Snackbar restent inchangés */}
        </Box>
    );
};

export default BillDetails;