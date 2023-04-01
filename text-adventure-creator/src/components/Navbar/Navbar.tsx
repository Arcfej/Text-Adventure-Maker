// Based on https://mui.com/material-ui/react-app-bar/
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {LibraryAdd, Logout, Save, Update} from "@mui/icons-material";
import MenuList from '@mui/material/MenuList';
import Badge from '@mui/material/Badge';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from "@mui/material/ListItemText";
import LightDarkToggle from "../LightDarkToggle/LightDarkToggle";
import {firebaseAuth} from "../../firebase/firebase-config";
import PropTypes from "prop-types";

interface NavbarProps {
    isProjectOpened: boolean;
    isProjectSaved: boolean;
}

interface MenuOption {
    label: string;
    icon: JSX.Element;
}

const menuItems: MenuOption[] = [
    {
        label: 'New',
        icon: <LibraryAdd />,
    },
    {
        label: 'Load',
        icon: <Update />,
    },
    {
        label: 'Save',
        icon: <Save />,
    }];

const Navbar = ({isProjectOpened, isProjectSaved}: NavbarProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    {/* Logo on larger screens */}
                    <Typography
                        variant="h6"
                        component="a"
                        href="/"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Text Adventure Maker
                    </Typography>

                    {/* The menu on small screens */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }}}>
                        <Badge
                            color="error"
                            variant="dot"
                            overlap="circular"
                            invisible={!isProjectOpened || Boolean(anchorEl) || isProjectSaved}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Badge>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuList sx={{flexDirection: "column"}}>
                                {menuItems.map((item) => (
                                        <MenuItem key={item.label}>
                                            <Badge
                                                color="error"
                                                variant="dot"
                                                invisible={item.label !== 'Save' || !isProjectOpened || isProjectSaved}
                                            >
                                                <ListItemIcon>{item.icon}</ListItemIcon>
                                                <ListItemText>{item.label}</ListItemText>
                                            </Badge>
                                        </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>
                    {/* Logo on small screens */}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            ml: 1,
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Text Adventure Maker
                    </Typography>

                    {/* The menu on larger screens */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {menuItems.map((item) => (
                            <Badge
                                color="error"
                                variant="dot"
                                invisible={item.label !== 'Save' || !isProjectOpened || isProjectSaved}
                                sx={{ my: 2, mx: 1 }}
                            >
                                <Button
                                    key={item.label}
                                    startIcon={item.icon}
                                    onClick={handleCloseMenu}
                                    sx={{ color: 'white' }}
                                >
                                    {item.label}
                                </Button>
                            </Badge>
                        ))}
                    </Box>
                    <LightDarkToggle sx={{mr: 1}} />
                    <Button
                        variant="contained"
                        color="secondary"
                        disableElevation
                        endIcon={<Logout />}
                        onClick={() => firebaseAuth.signOut()}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

Navbar.propTypes = {
    isProjectOpened: PropTypes.bool.isRequired,
    isProjectSaved: PropTypes.bool.isRequired,
};
export default Navbar;
