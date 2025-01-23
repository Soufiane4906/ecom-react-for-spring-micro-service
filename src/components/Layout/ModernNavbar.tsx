// src/components/Navbar/ModernNavbar.tsx
import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    IconButton,
    Drawer,
    List,
    ListItem,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon, Dashboard, ShoppingCart, People, Receipt, Logout } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
    adminOnly?: boolean;
}

const ModernNavbar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [user, setUser] = React.useState<any>(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navigate = useNavigate();

    const NAV_ITEMS: NavItem[] = [
        { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { label: 'Products', icon: <ShoppingCart />, path: '/products' },
        { label: 'Customers', icon: <People />, path: '/customers', adminOnly: true },
        { label: 'Bills', icon: <Receipt />, path: '/dashboard/bills/1' }
    ];

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded: any = jwtDecode(token);
            setUser({
                name: decoded.name,
                email: decoded.email,
                role: decoded.email === 'anibasoufiane2001@gmail.com' ? 'Admin' : 'User'
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const renderNavItems = () => (
        <List sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            {NAV_ITEMS.map((item) => (
                (!item.adminOnly || user?.role === 'Admin') && (
                    <ListItem
                        key={item.path}
                        component={Link}
                        to={item.path}
                        sx={{
                            color: theme.palette.text.primary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                color: theme.palette.primary.main,
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        {item.icon}
                        {item.label}
                    </ListItem>
                )
            ))}
        </List>
    );

    return (
        <>
            <AppBar
                position="static"
                color="transparent"
                elevation={0}
                sx={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255,255,255,0.8)'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography
                            variant="h5"
                            component={Link}
                            to="/dashboard"
                            sx={{
                                textDecoration: 'none',
                                color: theme.palette.text.primary,
                                fontWeight: 700
                            }}
                        >
                            EcomDash
                        </Typography>

                        {!isMobile && renderNavItems()}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {user && (
                            <>
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        width: 40,
                                        height: 40
                                    }}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </Avatar>
                                {!isMobile && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Logout />}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                )}
                            </>
                        )}

                        {isMobile && (
                            <IconButton onClick={() => setMobileOpen(true)}>
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {isMobile && (
                <Drawer
                    anchor="right"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 250,
                            backgroundColor: theme.palette.background.default
                        }
                    }}
                >
                    {renderNavItems()}
                    {user && (
                        <ListItem
                            button
                            onClick={handleLogout}
                            sx={{
                                color: theme.palette.error.main,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <Logout />
                            Logout
                        </ListItem>
                    )}
                </Drawer>
            )}
        </>
    );
};

export default ModernNavbar;