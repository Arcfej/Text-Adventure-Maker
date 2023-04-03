import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import {firebaseAuth} from "../../firebase/firebase-config";
import Dialog from '@mui/material/Dialog'
import ListItem from'@mui/material/ListItem'
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface Project {
    _id: string,
    title: string,
}

interface LoadProjectModalProps {
    open: boolean,
    handleClose: (projectId: string | null) => void,
}

const LoadProjectDialog = ({open, handleClose}: LoadProjectModalProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            const token = await firebaseAuth.currentUser?.getIdToken();
            const url = "https://backend.text-adventure-maker.workers.dev/creator/drafts/";
            fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer: ' + token
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    setProjects(data.drafts);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };
        if (open) loadProjects();
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={() => {
                handleClose(null);
                setSelectedProject(null);
            }}
            aria-labelledby="modal-title"
            // aria-describedby="modal-description"
        >
            <DialogTitle>Select a project to load</DialogTitle>
            <Divider/>
            <DialogContent sx={{padding: 0, marginTop: 0}}>
                <List>
                    {projects.map((project) => (<>
                        <ListItem key={project._id} disablePadding divider>
                            <ListItemButton
                                selected={selectedProject === project._id}
                                onClick={() => setSelectedProject(project._id)}
                            >
                                <ListItemText primary={project.title}/>
                            </ListItemButton>
                        </ListItem>
                    </>))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    handleClose(null);
                    setSelectedProject(null);
                }}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        handleClose(selectedProject);
                        setSelectedProject(null);
                    }}
                    disabled={selectedProject === null}
                    variant="contained"
                >
                    Load
                </Button>
            </DialogActions>
        </Dialog>
    );
};

LoadProjectDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default LoadProjectDialog;
