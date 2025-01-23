// src/components/Layout/ModernLayout.tsx
import React from 'react';
import { Box, Container, ThemeProvider, createTheme } from '@mui/material';
import ModernNavbar from './ModernNavbar';
import ModernFooter from './ModernFooter';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3A4CAD',
            light: '#6A7FDB',
            dark: '#1F2B75'
        },
        background: {
            default: '#F4F6FF',
            paper: '#FFFFFF'
        },
        text: {
            primary: '#2C3E50',
            secondary: '#576574'
        }
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 600,
        },
        body1: {
            lineHeight: 1.6
        }
    },
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingTop: '1.5rem',
                    paddingBottom: '1.5rem',
                    '@media (min-width:600px)': {
                        paddingTop: '2rem',
                        paddingBottom: '2rem',
                    }
                }
            }
        }
    }
});

const ModernLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default
                }}
            >
                <ModernNavbar />
                <Container
                    maxWidth="xl"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}
                >
                    {children}
                </Container>
                <ModernFooter />
            </Box>
        </ThemeProvider>
    );
};

export default ModernLayout;