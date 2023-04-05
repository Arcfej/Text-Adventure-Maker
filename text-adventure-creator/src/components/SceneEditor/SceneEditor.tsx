import React from 'react';
import PropTypes from 'prop-types';
import Paper from "@mui/material/Paper";

interface EditorNodeProps {

}

const SceneEditor = ({}:EditorNodeProps) => (
    <Paper
        variant="outlined"
        elevation={1}
        square
        sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 10,
            height: `calc(100% - 190px)`,
            width: '30%',
            margin: 1,
            borderWidth: 2,
            // borderColor: 'grey.900',
        }}
    >
        <h4>Editor</h4>
    </Paper>
);

SceneEditor.propTypes = {

};

export default SceneEditor;
