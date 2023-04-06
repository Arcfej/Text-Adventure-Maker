import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface ChoiceFormProps {
    onChange: (choices: string[]) => void;
}

const ChoiceForm = ({onChange}: ChoiceFormProps): JSX.Element => {
    const [choices, setChoices] = React.useState<string[]>([]);

    useEffect(() => {
        onChange(choices);
    }, [choices, onChange]);

    const addChoice = () => {
        setChoices([...choices, '']);
    }

    const removeChoice = (index: number) => {
        setChoices(choices.filter((_, i) => i !== index));
    }

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChoices(choices.map((choice, index) =>
            index === parseInt(event.target.name)
                ? event.target.value
                : choice));
    }, [setChoices]);

    return (<>
        <Typography variant="h6">Choices</Typography>
        <Stack direction="column" spacing={1} maxHeight="85%" sx={{overflowY: 'auto'}}>
            {choices.map((choice: string, index: number) => (
                <Stack key={index} direction="row" spacing={1}>
                    <TextField
                        name={`${index}`}
                        size="small"
                        hiddenLabel
                        variant="filled"
                        fullWidth
                        defaultValue={choice}
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
