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
import {Logout, NoteAdd, Save, Update} from "@mui/icons-material";
import MenuList from '@mui/material/MenuList';
import Badge from '@mui/material/Badge';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from "@mui/material/ListItemText";
import LightDarkToggle from "../LightDarkToggle/LightDarkToggle";
import {firebaseAuth} from "../../firebase/firebase-config";
import PropTypes from "prop-types";
import NewProjectWizard from "../NewProjectWizard";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import {Node, Edge} from 'reactflow';

interface MenuOption {
    label: string;
    icon: JSX.Element;
}

const menuItems: MenuOption[] = [
    {
        label: 'New',
        icon: <NoteAdd />,
    },
    {
        label: 'Load',
        icon: <Update />,
    },
    {
        label: 'Save',
        icon: <Save />,
    }];

interface SmallScreenMenuProps {
    openedProject: string | null;
    isProjectSaved: boolean;
    handleMenuClick: (target: string) => void;
}
const SmallScreenMenu = ({
    openedProject,
    isProjectSaved,
    handleMenuClick
}: SmallScreenMenuProps) : JSX.Element => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                <Badge
                    color="error"
                    variant="dot"
                    overlap="circular"
                    invisible={openedProject === null || Boolean(anchorEl) || isProjectSaved}
                >
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenMenu}
                        color="inherit"
                    >
                        <MenuIcon/>
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
                        display: {xs: 'block', md: 'none'},
                    }}
                >
                    <MenuList sx={{flexDirection: "column"}}>
                        {menuItems.map((item) => (
                            <MenuItem key={item.label} onClick={() => {
                                handleCloseMenu();
                                handleMenuClick(item.label);
                            }}>
                                <Badge
                                    color="error"
                                    variant="dot"
                                    invisible={item.label !== 'Save' || openedProject === null || isProjectSaved}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText>{item.label}</ListItemText>
                                </Badge>
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
                    display: {xs: 'flex', md: 'none'},
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
        </>
    );
};

SmallScreenMenu.propTypes = {
    openedProject: PropTypes.string,
    isProjectSaved: PropTypes.bool.isRequired,
    handleMenuClick: PropTypes.func.isRequired
};

interface LargerScreenMenuProps {
    openedProject: string | null;
    isProjectSaved: boolean;
    handleMenuClick: (target: string) => void;
}
const LargerScreenMenu = ({openedProject, isProjectSaved, handleMenuClick}: LargerScreenMenuProps): JSX.Element => (
    <>
        <Typography
            variant="h6"
            component="a"
            href="/"
            noWrap
            sx={{
                mr: 2,
                display: {xs: 'none', md: 'flex'},
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
            }}
        >
            Text Adventure Maker
        </Typography>
        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {menuItems.map((item) => (
                <Badge
                    key={item.label}
                    color="error"
                    variant="dot"
                    invisible={item.label !== 'Save' || openedProject === null || isProjectSaved}
                    sx={{my: 2, mx: 1}}
                >
                    <Button
                        startIcon={item.icon}
                        onClick={() => handleMenuClick(item.label)}
                        sx={{color: 'white'}}
                    >
                        {item.label}
                    </Button>
                </Badge>
            ))}
        </Box>
    </>
);

LargerScreenMenu.propTypes = {
    openedProject: PropTypes.string,
    isProjectSaved: PropTypes.bool.isRequired,
    handleMenuClick: PropTypes.func.isRequired
}

interface NavbarProps {
    openedProject: string | null;
    setOpenedProject: (projectId: string) => void;
    isProjectSaved: boolean;
    setIsProjectSaved: (isProjectSaved: boolean) => void;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
}

const Navbar = ({openedProject, setOpenedProject, isProjectSaved, setIsProjectSaved, setEdges, setNodes}: NavbarProps) => {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [warningDialogOpen, setWarningDialogOpen] = useState(false);

    const handleMenuClick = (target: string) => {
        switch (target) {
            case 'New': {
                if (isProjectSaved || openedProject === null) {
                    setIsWizardOpen(true);
                } else {
                    setWarningDialogOpen(true);
                }
                break;
            }
            case 'Load': {
                if (isProjectSaved || openedProject === null) {
                    // TODO
                    console.log('Load project');
                } else {
                    setWarningDialogOpen(true);
                }
                break;
            }
             case 'Save': {
                if (openedProject !== null) {
                    // TODO
                    console.log('Save project');
                }
                break;
             }
             default: {
                    console.log('Unknown menu item');
             }
        }
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <SmallScreenMenu
                        // anchorEl={anchorEl}
                        openedProject={openedProject}
                        isProjectSaved={isProjectSaved}
                        // handleOpenMenu={handleOpenMenu}
                        // handleCloseMenu={handleCloseMenu}
                        handleMenuClick={handleMenuClick}
                    />

                    <LargerScreenMenu
                        openedProject={openedProject}
                        isProjectSaved={isProjectSaved}
                        handleMenuClick={handleMenuClick}
                    />
                    <LightDarkToggle sx={{mr: 1}}/>
                    <Button
                        variant="contained"
                        color="secondary"
                        disableElevation
                        endIcon={<Logout/>}
                        onClick={() => {
                            setWarningDialogOpen(true);
                            // TODO sign out only if project is saved or discarded
                            return firebaseAuth.signOut();
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
                <NewProjectWizard
                    open={isWizardOpen}
                    passedHandleClose={() => setIsWizardOpen(false)}
                    setOpenedProject={setOpenedProject}
                    setEdges={setEdges}
                    setNodes={setNodes}
                />
                <Dialog open={warningDialogOpen} onClose={() => setWarningDialogOpen(false)}>
                    <DialogTitle>Warning</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Project is not saved. Do you want to save it?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="info" onClick={() => setWarningDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                // TODO
                                setWarningDialogOpen(false);
                            }}
                        >
                            Discard Changes
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                // TODO
                                setWarningDialogOpen(false);
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </AppBar>
    );
};

Navbar.propTypes = {
    openedProject: PropTypes.string,
    setOpenedProject: PropTypes.func.isRequired,
    isProjectSaved: PropTypes.bool.isRequired,
    setIsProjectSaved: PropTypes.func.isRequired,
    setEdges: PropTypes.func.isRequired,
    setNodes: PropTypes.func.isRequired
};
export default Navbar;
