import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Paper from "@mui/material/Paper";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import {Node} from "reactflow";

interface EditorNodeProps {
    editedNode: Node | null,
    nodes: Node[],
    setNodes: (nodes: Node[]) => void,
}

const SceneEditor = ({editedNode, nodes, setNodes}: EditorNodeProps) => {
    const [label, setLabel] = React.useState<string>(editedNode?.data?.label ?? "");
    const [body, setBody] = React.useState<string>(editedNode?.data?.body ?? "");

    // Reset label and body if a new scene is selected
    useEffect(() => {
        setLabel(editedNode?.data?.label ?? "");
        setBody(editedNode?.data?.body ?? "");
    }, [editedNode]);

    // save modification to the data
    useEffect(() => {
        setNodes(nodes.map((node) => {
            if (node.id === editedNode?.id) {
                node.data = {
                    ...node.data,
                    body: body,
                    label: label,
                };
            }
            return node;
        }));
    }, [label, body, setNodes]);

    const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(event.target.value);
    };

    const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBody(event.target.value);
    };

    return (
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
                component="form"
                direction="column"
                alignItems="stretch"
                justifyContent="flex-start"
                height="100%"
            >
                <TextField
                    id="scene-label"
                    label="Label"
                    required
                    value={label ? label : ""}
                    variant="filled"
                    InputLabelProps={{shrink: true}}
                    onChange={handleLabelChange}
                />
                <Box padding={1} justifyContent="stretch" flexGrow={1} sx={{overflowY: 'auto', maxHeight: "100%"}}>
                    <TextField
                        id="scene-body"
                        label="Scene Script"
                        value={body ? body : ""}
                        variant="filled"
                        multiline
                        fullWidth
                        onChange={handleBodyChange}
                    />
                </Box>
            </Stack>
        </Paper>
    );
};

SceneEditor.propTypes = {
    editedNode: PropTypes.object,
    nodes: PropTypes.array.isRequired,
    setNodes: PropTypes.func.isRequired,
};

export default SceneEditor;
