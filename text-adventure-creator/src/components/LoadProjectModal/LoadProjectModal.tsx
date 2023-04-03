import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from "@mui/material";

interface LoadProjectModalProps {
    open: boolean,
    handleClose: () => void,
}

const LoadProjectModal = ({open, handleClose}: LoadProjectModalProps) => (
    <Modal
        open={open}
        onClose={handleClose}
    >
        <div>text</div>
    </Modal>
);

LoadProjectModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default LoadProjectModal;
