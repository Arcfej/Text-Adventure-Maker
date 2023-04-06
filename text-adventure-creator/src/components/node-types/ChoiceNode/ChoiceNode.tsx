import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Card from "@mui/material/Card";
import {Handle, Node, NodeProps, Position} from "reactflow";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

type NodeChoiceData = {
    label: string;
    choices: string[];
}

export type ChoiceNodeType = Node<NodeChoiceData>;

const ChoiceNode = ({data}: NodeProps<NodeChoiceData>) => (
    <Card sx={{border: 1, borderColor: "grey.500"}}>
        <Handle type="target" position={Position.Left} style={{background: "#555"}}/>
        <CardHeader title={data.label}/>
        {data.choices &&
            <CardContent>
                {data.choices?.map((choice, index, array) => (<>
                    <Typography>{choice}</Typography>
                    <Handle
                        id={`${index}`}
                        type="source"
                        position={Position.Right}
                        style={{background: "#555", top: 'auto', bottom: 30}}
                    />
                </>))}
            </CardContent>
            }
    </Card>
);

ChoiceNode.propTypes = {
    data: PropTypes.object.isRequired
};

export default memo(ChoiceNode);
