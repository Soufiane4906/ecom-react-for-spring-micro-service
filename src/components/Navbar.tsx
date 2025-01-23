// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, useTheme, Avatar, Menu, MenuItem } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import logo from '../assets/logo.png'; // Importez le logo

interface User {
    name: string;
    email: string;
    role: string;
}

const Navbar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [user, setUser] = React.useState<User | null>(null);

    // Récupérer les informations de l'utilisateur à partir du token
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            const role = decodedToken.email === 'anibasoufiane2001@gmail.com' ? 'Admin' : 'User';
            setUser({ name: decodedToken.name, email: decodedToken.email, role });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Couleur de la navbar en fonction du rôle
    const navbarColor = user?.role === 'Admin' ? '#4caf50' : '#1976d2';

    return (
        <AppBar position="static" sx={{ backgroundColor: navbarColor }}>
            <Toolbar>
                {/* Logo avec lien vers le tableau de bord */}
                <Box
                    component={Link}
                    to="/dashboard"
                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexGrow: 1 }}
                >
                    <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                        Ecom Dashboard
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {user && (
                        <>
                            <Avatar sx={{ bgcolor: '#ffeb3b' }} onClick={handleMenuOpen}>
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <MenuItem>
                                    <Typography variant="body1">{user.name}</Typography>
                                </MenuItem>
                                <MenuItem>
                                    <Typography variant="body2">{user.email}</Typography>
                                </MenuItem>
                                <MenuItem>
                                    <Typography variant="body2">Role: {user.role}</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <Typography variant="body2" color="error">
                                        Logout
                                    </Typography>
                                </MenuItem>
                            </Menu>
                            <Button color="inherit" component={Link} to="/products" sx={{ textTransform: 'none', fontSize: isMobile ? '14px' : '16px' }}>
                                Products
                            </Button>
                        </>
                    )}
                    {user?.role === 'Admin' && (
                        <>
                            <Button color="inherit" component={Link} to="/customers" sx={{ textTransform: 'none', fontSize: isMobile ? '14px' : '16px' }}>
                                Customers
                            </Button>
                        </>
                    )}
                    <Button color="inherit" component={Link} to="/dashboard/bills/1" sx={{ textTransform: 'none', fontSize: isMobile ? '14px' : '16px' }}>
                        Bills
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;