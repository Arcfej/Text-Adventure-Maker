import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from "@mui/material";
import Typography from "@mui/material/Typography";

interface LoadProjectModalProps {
    open: boolean,
    handleClose: () => void,
}

const LoadProjectModal = ({open, handleClose}: LoadProjectModalProps) => (
    <Modal
        open={open}
        onClose={handleClose}
    >
        <Typography>text</Typography>
    </Modal>
);

LoadProjectModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default LoadProjectModal;
