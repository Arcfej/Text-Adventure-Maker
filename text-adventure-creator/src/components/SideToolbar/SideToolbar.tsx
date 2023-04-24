import React from 'react';
import PropTypes from 'prop-types';
import IconButton from "@mui/material/IconButton";
import {PostAdd} from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import {Node, Edge} from "reactflow";

interface SideToolbarProps {
    nodes: Node[],
    setNodes: (nodes: Node[]) => void,
    edges: Edge[],
    setEdges: (edges: Edge[]) => void,
}

const SideToolbar = ({nodes, setNodes, edges, setEdges}: SideToolbarProps) => {
    const addNode = () => {
        console.log("add node");
    }

    return (
        <Stack
            padding={0.5}
            boxShadow={3}
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            height="100%"
            sx={{backgroundColor: (theme) => {
                    return theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.primary.light;
                }}}
        >
            <IconButton onClick={addNode}>
                <PostAdd/>
            </IconButton>
        </Stack>
    );
};

SideToolbar.propTypes = {

};

export default SideToolbar;
