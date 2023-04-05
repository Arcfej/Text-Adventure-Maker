import React from 'react';
import PropTypes from 'prop-types';
import Paper from "@mui/material/Paper";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";

interface EditorNodeProps {

}

const SceneEditor = ({}:EditorNodeProps) => (
    <Paper
        elevation={1}
        square
        sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 10,
            height: `calc(100% - 190px)`,
            width: '35%',
            margin: 1,
            border: .5,
        }}
    >
        <Stack
            direction="column"
            alignItems="stretch"
            justifyContent="flex-start"
            height="100%"
        >
            <TextField
                id="scene-title"
                label="Scene Title (optional)"
                defaultValue=""
                variant="filled"
            />
            <Box padding={1} justifyContent="stretch" flexGrow={1} sx={{overflowY: 'auto', maxHeight: "100%"}}>
                <TextField
                    id="scene-body"
                    label="Scene Script"
                    variant="filled"
                    multiline
                    fullWidth
                />
            </Box>
        </Stack>
    </Paper>
);

SceneEditor.propTypes = {

};

export default SceneEditor;
