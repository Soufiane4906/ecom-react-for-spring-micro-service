// src/components/Footer/ModernFooter.tsx
import React from 'react';
import {
    Box,
    Container,
    Typography,
    Link as MuiLink,
    IconButton
} from '@mui/material';
import {
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    Twitter as TwitterIcon
} from '@mui/icons-material';

const ModernFooter: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                py: 4,
                borderTop: '1px solid rgba(0,0,0,0.1)'
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} EcomDash. All rights reserved.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            href="https://github.com"
                            target="_blank"
                            color="primary"
                            sx={{ transition: 'transform 0.3s' }}
                        >
                            <GitHubIcon />
                        </IconButton>
                        <IconButton
                            href="https://linkedin.com"
                            target="_blank"
                            color="primary"
                            sx={{ transition: 'transform 0.3s' }}
                        >
                            <LinkedInIcon />
                        </IconButton>
                        <IconButton
                            href="https://twitter.com"
                            target="_blank"
                            color="primary"
                            sx={{ transition: 'transform 0.3s' }}
                        >
                            <TwitterIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <MuiLink
                            href="#"
                            color="text.secondary"
                            underline="hover"
                            sx={{ transition: 'color 0.3s' }}
                        >
                            Privacy Policy
                        </MuiLink>
                        <MuiLink
                            href="#"
                            color="text.secondary"
                            underline="hover"
                            sx={{ transition: 'color 0.3s' }}
                        >
                            Terms of Service
                        </MuiLink>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default ModernFooter;