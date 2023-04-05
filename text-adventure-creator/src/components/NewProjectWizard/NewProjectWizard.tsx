import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import {firebaseAuth} from "../../firebase/firebase-config";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {Node, Edge} from 'reactflow';

interface FormData {
    title: string
}

interface NewProjectWizardProps {
    open: boolean,
    handleClose: () => void,
    setOpenedProject: (projectId: string) => void;
    setNodes: (nodes: Node[]) => void,
    setEdges: (edges: Edge[]) => void,
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
    setIdCounter: (idCounter: number) => void,
    setProjectTitle: (projectTitle: string) => void,
}

const NewProjectWizard = ({
    open,
    handleClose,
    setOpenedProject,
    setNodes,
    setEdges,
    setIsLoading,
    setIdCounter,
    setProjectTitle,
}: NewProjectWizardProps) : JSX.Element => {
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({
        title: '',
    });

    const handleCloseInside = () => {
        setIsLoading(false);
        handleClose();
        setError('');
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const createNewProject = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const token = await firebaseAuth.currentUser?.getIdToken();
        // return fetch("http://localhost:8787/creator/drafts",
        return fetch("https://backend.text-adventure-maker.workers.dev/creator/drafts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer: ' + token
                },
                body: JSON.stringify({
                    draft: {
                        title: formData.title,
                    },
                })
            })
            .then(async response => {
                const result = await response.json();
                if (response.status !== 200) {
                    throw Error(result.error);
                }
                return result;
            })
            .then(result => {
                setOpenedProject(result._id);
                setNodes(result.graph.nodes);
                setEdges(result.graph.edges);
                setIdCounter(result.graph.idCounter);
                setProjectTitle(result.title);
                handleCloseInside();
            })
            .catch(error => {
                console.error(error);
                setError(error.message);
                setIsLoading(false);
            });
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseInside}
            aria-labelledby="modal-modal-title"
            // aria-describedby="modal-modal-description"
        >
            <form onSubmit={createNewProject}>
                <Stack
                    gap={2}
                    sx={{
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Create a new project
                    </Typography>
                    <TextField
                        name="title"
                        error={error !== ''}
                        helperText={error}
                        required
                        id="title"
                        label="Project title"
                        placeholder="Untitled Project"
                        variant="filled"
                        autoFocus
                        onChange={handleChange}
                    />
                    <Stack direction="row" gap={2} justifyContent="flex-end">
                        <Button color="info" variant="outlined" onClick={handleCloseInside}>Cancel</Button>
                        <Button type="submit" color="primary" variant="contained">Create</Button>
                    </Stack>
                </Stack>
            </form>
        </Dialog>
    );
};

NewProjectWizard.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    setOpenedProject: PropTypes.func.isRequired,
    setNodes: PropTypes.func.isRequired,
    setEdges: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    setIsLoading: PropTypes.func.isRequired,
    setIdCounter: PropTypes.func.isRequired,
    setProjectTitle: PropTypes.func.isRequired,
};

export default NewProjectWizard;
