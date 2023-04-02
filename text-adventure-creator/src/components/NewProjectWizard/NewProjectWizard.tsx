import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import {firebaseAuth} from "../../firebase/firebase-config";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from "@mui/material/Dialog";

interface FormData {
    title: string
}

interface NewProjectWizardProps {
    open: boolean,
    passedHandleClose: () => void,
    setOpenedProject: (projectId: string) => void;
}

const NewProjectWizard = ({open, passedHandleClose, setOpenedProject}: NewProjectWizardProps):JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({
        title: '',
    });

    const handleClose = () => {
        setIsLoading(false);
        passedHandleClose();
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
        console.log(formData);

        const token = await firebaseAuth.currentUser?.getIdToken();
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
                setOpenedProject(result.insertedId);
                handleClose();
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
            onClose={handleClose}
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
                        onChange={handleChange}
                    />
                    <Stack direction="row" gap={2} justifyContent="flex-end">
                        <Button color="info" variant="outlined" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" color="primary" variant="contained">Create</Button>
                    </Stack>
                </Stack>
            </form>
            <Backdrop open={isLoading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        </Dialog>
    );
};

NewProjectWizard.propTypes = {
    open: PropTypes.bool.isRequired,
    passedHandleClose: PropTypes.func.isRequired,
    setOpenedProject: PropTypes.func.isRequired
};

export default NewProjectWizard;
