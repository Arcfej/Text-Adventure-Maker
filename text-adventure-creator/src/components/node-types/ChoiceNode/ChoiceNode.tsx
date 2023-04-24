import React, {memo} from 'react';
import PropTypes from 'prop-types';
import Card from "@mui/material/Card";
import {Handle, Node, NodeProps, Position} from "reactflow";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";
import { useTheme } from '@mui/material/styles';

type NodeChoiceData = {
    label: string;
    choices: string[];
}

export type ChoiceNodeType = Node<NodeChoiceData>;

const ChoiceNode = ({data, id}: NodeProps<NodeChoiceData>) => {
    const theme = useTheme();
    return (
        <Card sx={{border: 1, borderColor: "grey.500"}}>
            {id !=='1' && <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: "#555",
                    borderColor: "#000",
                    borderRadius: "2px",
                    backgroundColor: theme.palette.mode === 'light' ? theme.palette.warning.light : theme.palette.warning.dark,
                    width: "10px",
                    height: "30px",
                    top: 31
                }}
            />}
            <CardHeader title={data.label}/>
            {data.choices?.length > 0 &&
                <CardContent>
                    <Stack minWidth="200px" direction="column" spacing={1} minHeight={32 * (data.choices?.length - 1)}
                           alignItems="flex-end" marginRight={-1}>
                        {data.choices?.map((choice, index, array) => (
                            <Box key={index}>
                                <Handle
                                    id={`${index}`}
                                    type="source"
                                    position={Position.Right}
                                    style={{
                                        width: "80%",
                                        height: "25px",
                                        borderColor: "#000",
                                        borderRadius: "2px 0 0 2px",
                                        backgroundColor: theme.palette.mode === 'light' ? theme.palette.success.light : theme.palette.success.dark,
                                        top: 'auto',
                                        bottom: (32 * (array.length - index - 1)),
                                        right: -5,
                                        padding: "0 20px",
                                        textAlign: "right",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        color: theme.palette.success.contrastText,
                                    }}
                                >
                                    {choice}
                                </Handle>
                            </Box>
                        ))}
                    </Stack>
                </CardContent>
            }
        </Card>
    );
};

ChoiceNode.propTypes = {
    data: PropTypes.object.isRequired
};

export default memo(ChoiceNode);
