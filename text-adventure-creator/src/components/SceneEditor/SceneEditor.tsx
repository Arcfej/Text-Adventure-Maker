import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import Paper from "@mui/material/Paper";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import {Node} from "reactflow";
import ChoiceForm from "../ChoiceForm";
import Divider from "@mui/material/Divider";

interface EditorNodeProps {
    editedNode: Node | null,
    nodes: Node[],
    setNodes: (nodes: Node[]) => void,
}

const SceneEditor = ({editedNode, nodes, setNodes}: EditorNodeProps) => {
    const [label, setLabel] = React.useState<string>(editedNode?.data?.label ?? "");
    const [body, setBody] = React.useState<string>(editedNode?.data?.body ?? "");
    const [choices, setChoices] = React.useState<string[]>(editedNode?.data?.choices ?? []);

    // Reset label and body if a new scene is selected
    useEffect(() => {
        setLabel(editedNode?.data?.label ?? "");
        setBody(editedNode?.data?.body ?? "");
        setChoices(editedNode?.data?.choices ?? []);
    }, [editedNode]);

    // save modification to the data
    useEffect(() => {
        setNodes(nodes.map((node) => {
            if (node.id === editedNode?.id) {
                node.data = {
                    ...node.data,
                    label: label,
                    body: body,
                    choices: choices,
                };
            }
            return node;
        }));
    }, [label, body, choices, setNodes, editedNode?.id]);

    const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(event.target.value);
    };

    const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBody(event.target.value);
    };

    const handleChoicesChange = useCallback((choices: string[]) => {
        setChoices(choices);
    }, [setChoices]);

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
                <Box padding={1} flexGrow={1} maxHeight="100%" sx={{overflowY: 'auto'}}>
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
                <Divider/>
                <Box padding={1} width="100%" maxHeight="50%">
                    <ChoiceForm onChange={handleChoicesChange} choices={choices} />
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
