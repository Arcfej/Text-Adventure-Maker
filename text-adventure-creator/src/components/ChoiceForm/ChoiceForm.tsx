import React from 'react';
import PropTypes from 'prop-types';
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useEdges, getConnectedEdges, Edge, Node} from "reactflow";

interface ChoiceFormProps {
    choices: string[];
    onChange: (choices: string[]) => void;
    editedNode: Node | null;
    setEdges: (edges: Edge[]) => void;
}

const ChoiceForm = ({choices, onChange, editedNode, setEdges}: ChoiceFormProps): JSX.Element => {
    const edges = useEdges();

    const addChoice = () => {
        onChange([...choices, '']);
    }

    const removeChoice = (index: number) => {
        if (editedNode) {
            const connectedEdges = getConnectedEdges([editedNode], edges);
            const edgesToRemove = connectedEdges.filter((edge) =>
                edge.source === editedNode.id && edge.sourceHandle === `${index}`);
            // Shift source handles of edges after the deleted choice
            const newEdges = edges.filter((edge) => !edgesToRemove.includes(edge))
                .map((edge) => {
                    if (edge.source === editedNode.id && edge.sourceHandle && parseInt(edge.sourceHandle) > index) {
                        return {...edge, sourceHandle: `${parseInt(edge.sourceHandle) - 1}`};
                    }
                    else return edge;
                });
            setEdges(newEdges);
            onChange(choices.filter((_, i) => i !== index));
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(choices.map((choice, index) => {
            if (index === parseInt(event.target.name)) {
                return event.target.value;
            }
            else return choice;
        }));
    };

    return (<>
        <Typography variant="h6">Choices</Typography>
        <Stack direction="column" spacing={1} maxHeight="85%" sx={{overflowY: 'auto'}}>
            {choices.map((choice: string, index: number) => (
                <Stack key={index} direction="row" spacing={1}>
                    <TextField
                        name={`${index}`}
                        key={index}
                        size="small"
                        hiddenLabel
                        variant="filled"
                        fullWidth
                        value={choice}
                        onChange={handleChange}
                    >
                        {choice}
                    </TextField>
                    <IconButton onClick={() => removeChoice(index)}>
                        <Delete/>
                    </IconButton>
                </Stack>
            ))}
            <Button variant="outlined" onClick={addChoice}>Add choice</Button>
        </Stack>
    </>);
};

ChoiceForm.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default ChoiceForm;
