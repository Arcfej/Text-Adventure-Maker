import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface ChoiceFormProps {

}

const ChoiceForm = ({}: ChoiceFormProps): JSX.Element => {
    const [choices, setChoices] = React.useState<string[]>([]);

    const addChoice = () => {
        setChoices([...choices, '']);
    }

    const removeChoice = (index: number) => {
        setChoices(choices.filter((_, i) => i !== index));
    }

    const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChoices(choices.map((choice, index) =>
            index === parseInt(event.target.id)
                ? event.target.value
                : choice));
    }, [setChoices]);

    return (<>
        <Typography variant="h6">Choices</Typography>
        <Stack direction="column" spacing={1} maxHeight="85%" sx={{overflowY: 'auto'}}>
            {choices.map((choice: string, index: number) => (
                <Stack key={index} direction="row" spacing={1}>
                    <TextField size="small" hiddenLabel variant="filled" fullWidth defaultValue={choice} onChange={onChange}></TextField>
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

};

export default ChoiceForm;
