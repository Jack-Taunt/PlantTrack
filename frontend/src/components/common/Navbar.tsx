import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import PlantIcon from "../../assets/PlantTrack_Icon-temp.svg"
import { useAuth } from "./AuthProvider";
import { Link, useLocation } from "react-router-dom";
import api from "../../client/client"

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { user, setUser } = useAuth();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleCloseUserMenu = () => {
        setAnchorEl(null);
    }

    const handleUserSignOut = async () => {
        await api.post("/users/logout");
        setUser(null);
    }

    const location = useLocation();

    return (
        <AppBar position="sticky">
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <IconButton 
                        sx={{ p: 0, width: 50, height: 50 }} 
                        component={Link}
                        to="/"
                    >
                        <img src={PlantIcon} style={{ width: "100%", height: "100%" }} />
                    </IconButton>
                    <Typography
                        variant="h6"
                        sx={{
                            ml: 3,
                            mr: 5,
                            fontWeight: 700
                        }}
                    >
                        Plant Track
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: {xs: 'flex'} }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ color: 'white', border: 1, borderColor: "#000" }}
                            component={Link}
                            to="/plants/public"
                            disabled={location.pathname === '/plants/public'}
                        >
                            Browse Plants
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ color: 'white', border: 1, borderColor: "#000", ml: 1  }}
                            component={Link}
                            to="/gardens/public"
                            disabled={location.pathname === '/gardens/public'}
                        >
                            Browse Community Gardens
                        </Button>
                        
                        {user && (
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ color: 'white', border: 1, borderColor: "#000", ml: 1 }}
                                component={Link}
                                to="/gardens/me"
                                disabled={location.pathname === '/gardens/me'}
                            >
                                My Gardens
                            </Button>
                        )}
                    </Box>
                    

                    <Box sx={{ flexGrow: 0, display: {xs: 'none', md: 'flex' } }}>
                        
                        {user ? (
                            <div>
                                <Tooltip title="Open User Settings"> 
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar src="/src/images/user1.jpg" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
                                    <MenuItem onClick={handleUserSignOut}>Sign Out</MenuItem>
                                </Menu>
                            </div>
                        ) : (
                            <Box>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ color: 'white', ml: 1 }}
                                    component={Link}
                                    to="/login"
                                >
                                    Sign In
                                </Button>
                            </Box>
                        )}
                        
                    </Box>
                </Toolbar>
            </Container>

        </AppBar>
        
    )
}

export default Navbar;