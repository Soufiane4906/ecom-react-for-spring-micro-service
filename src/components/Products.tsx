import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Pagination, Snackbar, Alert, CircularProgress
} from '@mui/material';
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";

const Products: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', price: 0, quantity: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(''); // Pour le filtre par catégorie
    const [purchasedProducts, setPurchasedProducts] = useState<Set<number>>(new Set());

    // Fetch products with pagination
    useEffect(() => {
        fetchProducts();
    }, [currentPage, selectedCategory]);

    useEffect(() => {
        const fetchPurchasedProducts = async () => {
            const purchased = new Set<number>();
            for (const product of products) {
                if (selectedCategory === '' || product.category === selectedCategory) {
                    const response = await axios.get(`http://localhost:8080/BILLING-SERVICE/products/${product.id}/isPurchased`);
                    if (response.data) {
                        purchased.add(product.id);
                    }
                }
            }
            setPurchasedProducts(purchased);
        };

        fetchPurchasedProducts();
    }, [products, selectedCategory]); // Ajoutez selectedCategory comme dépendance
    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `http://localhost:8080/INVENTORY-SERVICE/products?projection=p1&page=${currentPage - 1}&size=${itemsPerPage}`;
            if (selectedCategory) {
                url = `http://localhost:8080/INVENTORY-SERVICE/products/search/byCategory?category=${selectedCategory}&page=${currentPage - 1}&size=${itemsPerPage}`;
            }
            const response = await axios.get(url);
            const fetchedProducts = response.data._embedded.products;

            // Mettre à jour les produits
            setProducts(fetchedProducts);

            // Synchroniser purchasedProducts avec les produits filtrés
            const updatedPurchasedProducts = new Set<number>();
            fetchedProducts.forEach((product: any) => {
                if (purchasedProducts.has(product.id)) {
                    updatedPurchasedProducts.add(product.id);
                }
            });
            setPurchasedProducts(updatedPurchasedProducts);

            setTotalPages(response.data.page.totalPages);
        } catch (error) {
            setErrorMessage('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    // Handle search by product name
    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            setErrorMessage('Please enter a search keyword');
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:8080/INVENTORY-SERVICE/products/search/byName?keyword=${searchKeyword}&page=${currentPage - 1}&size=${itemsPerPage}`
            );
            setProducts(response.data._embedded.products);
            setTotalPages(response.data.page.totalPages);
        } catch (error) {
            setErrorMessage('Search failed');
        }
    };

    // Handle opening the dialog for adding/editing a product
    const handleOpenDialog = (product = { id: null, name: '', price: 0, quantity: 0 }) => {
        setCurrentProduct(product);
        setOpenDialog(true);
    };

    // Handle closing the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentProduct({ id: null, name: '', price: 0, quantity: 0 }); // Réinitialiser les champs
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentProduct({ ...currentProduct, [name]: value });
    };

    // Handle form submission (add or update product)
    const handleSubmit = async () => {
        try {
            if (currentProduct.id) {
                await axios.put(
                    `http://localhost:8080/INVENTORY-SERVICE/products/${currentProduct.id}`,
                    currentProduct
                );
            } else {
                await axios.post(
                    "http://localhost:8080/INVENTORY-SERVICE/products",
                    currentProduct
                );
            }
            fetchProducts();
            handleCloseDialog();
        } catch (error) {
            setErrorMessage(currentProduct.id ? 'Update failed' : 'Creation failed');
        }
    };

    // Handle deleting a product
    const handleDeleteProduct = (id: number) => {
        axios.delete(`http://localhost:8080/INVENTORY-SERVICE/products/${id}`)
            .then(() => fetchProducts())
            .catch(error => console.error(error));
    };

    const handlePurchase = async (id: number, quantity: number) => {
        try {
            const response = await axios.post(`http://localhost:8080/BILLING-SERVICE/products/${id}/purchase?quantity=${quantity}`);
            if (response.status === 200) {
                setErrorMessage('Purchase successful');
                fetchProducts(); // Refresh the product list
            } else {
                setErrorMessage('Purchase failed');
            }
        } catch (error) {
            setErrorMessage('Purchase failed: ' + error.message);
        }
    };

    // Handle pagination
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    // Handle category filter
    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Réinitialiser la pagination
    };
    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Product Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog()}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                    Add Product
                </Button>
            </Box>

            {/* Search Bar and Category Filter */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <TextField
                    label="Search by Name"
                    variant="outlined"
                    fullWidth
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{ borderRadius: '8px', textTransform: 'none', px: 4, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                >
                    Search
                </Button>
            </Box>

            {/* Category Filter Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                    variant={selectedCategory === 'Computer' ? 'contained' : 'outlined'}
                    onClick={() => handleCategoryFilter('Computer')}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                    Computers
                </Button>
                <Button
                    variant={selectedCategory === 'Printer' ? 'contained' : 'outlined'}
                    onClick={() => handleCategoryFilter('Printer')}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                    Printers
                </Button>
                <Button
                    variant={selectedCategory === 'Smart Phone' ? 'contained' : 'outlined'}
                    onClick={() => handleCategoryFilter('Smart Phone')}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                    Smart Phones
                </Button>
                <Button
                    variant={selectedCategory === '' ? 'contained' : 'outlined'}
                    onClick={() => handleCategoryFilter('')}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                    All Products
                </Button>
            </Box>

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress size={40} />
                </Box>
            )}

            {/* Products Table */}
            {!loading && (
                <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: '#1976d2' }}>
                            <TableRow   >
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>ID</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Price</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Quantity</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow  >
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="h6">No products found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map(product => (
                                    <TableRow key={product.id}
                                sx={{
                                '&:nth-of-type(odd)': { bgcolor: '#fafafa' },
                                '&:hover': { bgcolor: '#f0f0f0' },
                                transition: 'background-color 0.3s',
                                bgcolor: purchasedProducts.has(product.id) ? '#ffebee' : 'inherit' // Change background color if purchased
                            }}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleOpenDialog(product)} sx={{ '&:hover': { bgcolor: '#e3f2fd' } }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteProduct(product.id)} sx={{ '&:hover': { bgcolor: '#ffebee' }, ml: 1 }}>
                                                <Delete />
                                            </IconButton>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handlePurchase(product.id, 1)} // Assuming quantity is 1 for simplicity
                                                disabled={product.quantity <= 0 || purchasedProducts.has(product.id)} // Disable if quantity is 0 or less or already purchased
                                                sx={{ ml: 2, textTransform: 'none', bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                                            >
                                                Buy
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
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

            {/* Add/Edit Product Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>
                    {currentProduct.id ? 'Edit Product' : 'Add Product'}
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={currentProduct.name}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={currentProduct.price}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={currentProduct.quantity}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} color="secondary" sx={{ borderRadius: '6px', px: 3, textTransform: 'none', border: '1px solid #1976d2', color: '#1976d2' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ borderRadius: '6px', px: 3, textTransform: 'none', bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}>
                        {currentProduct.id ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error Handling */}
            <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="error" sx={{ bgcolor: '#fff', color: '#d32f2f', boxShadow: '0 3px 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Products;