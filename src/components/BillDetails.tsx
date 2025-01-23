import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const BillDetails: React.FC = () => {
    const [bill, setBill] = useState<any>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        axios.get(`http://localhost:8080/BILLING-SERVICE/fullBill/${id}`)
            .then(response => setBill(response.data))
            .catch(error => console.error(error));
    }, [id]);

    if (!bill) return <div>Loading...</div>;

    return (
        <div>
            <Card>
                <CardContent>
                    <Typography variant="h5">Bill number: {id}</Typography>
                    <Typography>Bill ID: {bill.id}</Typography>
                    <Typography>Bill Date: {new Date(bill.createdAt).toLocaleDateString()}</Typography>
                    <Typography>Customer ID: {bill.customer.id}</Typography>
                    <Typography>Customer Name: {bill.customer.name}</Typography>
                    <Typography>Customer Email: {bill.customer.email}</Typography>
                </CardContent>
            </Card>

            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product ID</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Amount</TableCell>
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
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={4}>Total</TableCell>
                            <TableCell>{bill.total.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default BillDetails;