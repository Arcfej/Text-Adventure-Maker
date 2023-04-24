import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import React from "react";

interface WarningDialogProps {
    open: boolean;
    handleClose: (answer: string) => void;
}

/**
 * Show a warning to the user about unsaved project before lossing progress.
 *
 * @param open true if the dialog is visible
 * @param handleClose pass 'Cancel', 'Discard' or 'Save' based on what the user chose
 * @constructor
 */
const WarningDialog = ({open, handleClose}: WarningDialogProps): JSX.Element => (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
            <DialogContentText>Project is not saved. Do you want to save it?</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button
                variant="outlined"
                color="info"
                onClick={() => handleClose('Cancel')}
            >
                Cancel
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={() => {
                    handleClose('Discard');
                }}
            >
                Discard Changes
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleClose('Save')}
            >
                Save
            </Button>
        </DialogActions>
    </Dialog>
);

WarningDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default WarningDialog;
