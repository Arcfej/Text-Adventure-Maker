// Based on https://mui.com/material-ui/react-app-bar/
import React, {useState} from 'react';
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
import {Logout, NoteAdd, Publish, Save, Update} from "@mui/icons-material";
import MenuList from '@mui/material/MenuList';
import Badge from '@mui/material/Badge';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from "@mui/material/ListItemText";
import LightDarkToggle from "../LightDarkToggle/LightDarkToggle";
import {firebaseAuth} from "../../firebase/firebase-config";
import PropTypes from "prop-types";
import NewProjectWizard from "../NewProjectWizard";
import {Edge, Node} from 'reactflow';
import LoadProjectDialog from "../LoadProjectDialog";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import SaveWarningDialog from "../SaveWarningDialog";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
    },
    {
        label: 'Publish',
        icon: <Publish />,
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
    setOpenedProject: (projectId: string | null) => void;
    isProjectSaved: boolean;
    setIsProjectSaved: (isProjectSaved: boolean) => void;
    edges: Edge[];
    nodes: Node[];
    setEdges: (edges: Edge[]) => void;
    setNodes: (nodes: Node[]) => void;
    idCounter: number;
    setIdCounter: (idCounter: number) => void;
    projectTitle: string;
    setProjectTitle: (projectName: string) => void;
}

const Navbar = ({
    openedProject,
    setOpenedProject,
    isProjectSaved,
    setIsProjectSaved,
    edges,
    nodes,
    setEdges,
    setNodes,
    idCounter,
    setIdCounter,
    projectTitle,
    setProjectTitle
}: NavbarProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [delayedMenuAction, setDelayedMenuAction] = useState<string | null>(null);
    const [wizardOpen, setWizardOpen] = useState(false);
    const [loadProjectDialogOpen, setLoadProjectDialogOpen] = useState(false);
    const [warningDialogOpen, setWarningDialogOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifySuccess, setNotifySuccess] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState<string>('');

    const saveProject = async (): Promise<boolean> => {
        setIsLoading(true);
        try {
            const token = await firebaseAuth.currentUser?.getIdToken();
            // const url = "http://localhost:8787/creator/drafts/" + openedProject + "/";
            const url = "https://backend.text-adventure-maker.workers.dev/creator/drafts/" + openedProject + "/";
            const response: Response = await fetch(url,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer: ' + token
                    },
                    body: JSON.stringify({
                        draft: {
                            graph: {
                                edges: edges,
                                nodes: nodes,
                                idCounter: idCounter,
                                startNode: '1',
                            },
                            title: projectTitle,
                        },
                    })
                });
            if (response.ok) {
                setIsProjectSaved(true);
                return true;
            } else {
                return false;
            }
        } catch(error) {
            console.error(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const publishProject = async (): Promise<boolean> => {
        const token = await firebaseAuth.currentUser?.getIdToken();
        // const url = "http://localhost:8787/creator/drafts/publish/" + openedProject + "/";
        const url = "https://backend.text-adventure-maker.workers.dev/creator/drafts/publish/" + openedProject + "/";
        const response: Response = await fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer: " + token,
                }
            });
        return response.ok;
    }

    const executeMenuAction = async (target: string | null) => {
        switch (target) {
            case 'Save': {
                if(await saveProject()) {
                    setNotifySuccess(true);
                    setNotificationMessage('Project saved successfully!');
                } else {
                    setNotifySuccess(false);
                    setNotificationMessage('Project could not be saved!');
                }
                setNotificationOpen(true);
                break;
            }
            case 'New': {
                setWizardOpen(true);
                break;
            }
            case 'Load': {
                setLoadProjectDialogOpen(true);
                break;
            }
            case 'Logout': {
                await firebaseAuth.signOut();
                break;
            }
            case 'Publish': {
                if(await publishProject()) {
                    setNotifySuccess(true);
                    setNotificationMessage('Project published successfully!');
                } else {
                    setNotifySuccess(false);
                    setNotificationMessage('Project could not be published!');
                }
                setNotificationOpen(true);
                break;
            }
            default:
                console.warn('No action to execute: ', target);
        }
    }

    const handleWarningDialogClose = async (dialogAnswer: string) => {
        setWarningDialogOpen(false);
        switch (dialogAnswer) {
            case 'Save': {
                const success = await saveProject();
                if (success) {
                    await executeMenuAction(delayedMenuAction);
                    setDelayedMenuAction(null);
                    setNotifySuccess(true);
                    setNotificationMessage('Project saved successfully!');
                } else {
                    setNotifySuccess(false);
                    setNotificationMessage('Project could not be saved!');
                    setWarningDialogOpen(true);
                }
                setNotificationOpen(true);
                break;
            }
            case 'Discard': {
                await executeMenuAction(delayedMenuAction);
                setDelayedMenuAction(null);
                break;
            }
            case 'Cancel': {
                setDelayedMenuAction(null);
                break;
            }
            default: console.warn('Unknown dialog answer');
        }
    }

    const handleMenuClick = (target: string) => {
        if (target === 'Save') {
            // Save the project if there's one opened or do nothing
            if (openedProject && !isProjectSaved) executeMenuAction('Save');
        }
        // If there's no opened project or the project is saved, execute the buttons' actions
        else if (isProjectSaved || openedProject === null) {
            executeMenuAction(target);
        }
        // If there's an opened project and it's not saved,
        // ask the user if he wants to save it and wait for the answer
        else {
            setDelayedMenuAction(target);
            setWarningDialogOpen(true);
        }
    }

    const handleLoadProject = async (projectId: string | null) => {
        setLoadProjectDialogOpen(false);
        if (projectId) {
            setIsLoading(true);
            const token = await firebaseAuth.currentUser?.getIdToken();
            // fetch("http://localhost:8787/creator/drafts/" + projectId + "/", {
            fetch("https://backend.text-adventure-maker.workers.dev/creator/drafts/" + projectId + "/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer: " + token
                }
            })
                .then(response => {
                    if (response.ok) return response.json();
                    else throw new Error("Something went wrong while loading the project");
                })
                .then(data => {
                    setNodes(data.graph.nodes);
                    setEdges(data.graph.edges);
                    setOpenedProject(projectId);
                    setIdCounter(data.graph.idCounter);
                    setProjectTitle(data.title);
                })
                .catch(error => {
                    // TODO show error message to user
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <SmallScreenMenu
                        // anchorEl={anchorEl}
                        openedProject={openedProject}
                        isProjectSaved={isProjectSaved}
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
                        onClick={() => handleMenuClick('Logout')}
                    >
                        Logout
                    </Button>
                </Toolbar>
                <NewProjectWizard
                    open={wizardOpen}
                    handleClose={() => setWizardOpen(false)}
                    setOpenedProject={setOpenedProject}
                    setEdges={setEdges}
                    setNodes={setNodes}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setIdCounter={setIdCounter}
                    setProjectTitle={setProjectTitle}
                />
                <LoadProjectDialog
                    open={loadProjectDialogOpen}
                    handleClose={handleLoadProject}
                />
                <SaveWarningDialog
                    open={warningDialogOpen}
                    handleClose={handleWarningDialogClose}
                />
            </Container>
            <Backdrop open={isLoading} sx={{zIndex: 1600}}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Snackbar
                open={notificationOpen}
                autoHideDuration={6000}
                onClose={() => setNotificationOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={() => setNotificationOpen(false)} severity={notifySuccess ? 'success' : 'error'}>
                    {notificationMessage}
                </Alert>
            </Snackbar>
        </AppBar>
    );
};

Navbar.propTypes = {
    openedProject: PropTypes.string,
    setOpenedProject: PropTypes.func.isRequired,
    isProjectSaved: PropTypes.bool.isRequired,
    setIsProjectSaved: PropTypes.func.isRequired,
    setEdges: PropTypes.func.isRequired,
    setNodes: PropTypes.func.isRequired,
    idCounter: PropTypes.number.isRequired,
    setIdCounter: PropTypes.func.isRequired,
    projectTitle: PropTypes.string.isRequired,
    setProjectTitle: PropTypes.func.isRequired,
};
export default Navbar;
