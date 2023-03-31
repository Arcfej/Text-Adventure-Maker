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
import {ListItemIcon, ListItemText} from "@mui/material";
import LightDarkToggle from "../LightDarkToggle/LightDarkToggle";
import {firebaseAuth} from "../../firebase/firebase-config";

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

function ResponsiveAppBar() {
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

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                            <MenuList>
                                {menuItems.map((item) => (
                                    <MenuItem key={item.label}>
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText>{item.label}</ListItemText>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            display: { xs: 'flex', md: 'none' },
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
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.label}
                                startIcon={item.icon}
                                onClick={handleCloseMenu}
                                sx={{ my: 2, mx: 1, color: 'white' }}
                            >
                                {item.label}
                            </Button>
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
}
export default ResponsiveAppBar;
