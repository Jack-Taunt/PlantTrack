import { AppBar, Avatar, Box, Button, Container, Icon, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import PlantIcon from "../../assets/PlantTrack_Icon-temp.svg"
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import api from "../../client/client"

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleCloseUserMenu = () => {
        setAnchorEl(null);
    }

    const redirectLoginPage = () => {
        navigate("/login")
    }

    const handleUserSignOut = async () => {
        await api.post("/users/logout");
        setUser(null);
    }

    const { user } = useAuth();

    return (
        <AppBar position="static">
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <Icon sx={{ fontSize: 40 }}>
                        <img src={PlantIcon} style={{ width: "100%", height: "100%" }} />
                    </Icon>
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
                            sx={{ color: 'white' }}
                        >
                            Browse Plants 1
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ color: 'white', ml: 1 }}
                        >
                            Browse Plants 2
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ color: 'white', ml: 1 }}
                        >
                            Browse Plants 3
                        </Button>
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
                                    onClick={redirectLoginPage}
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