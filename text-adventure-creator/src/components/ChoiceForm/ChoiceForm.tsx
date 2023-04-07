import React from 'react';
import PropTypes from 'prop-types';
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface ChoiceFormProps {
    choices: string[];
    onChange: (choices: string[]) => void;
}

const ChoiceForm = ({choices, onChange}: ChoiceFormProps): JSX.Element => {

    const addChoice = () => {
        onChange([...choices, '']);
    }

    const removeChoice = (index: number) => {
        onChange(choices.filter((_, i) => i !== index));
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
