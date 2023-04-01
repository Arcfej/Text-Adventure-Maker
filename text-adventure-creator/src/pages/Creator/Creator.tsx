import React, {useCallback, useEffect, useState} from 'react';
import { onAuthStateChanged } from "firebase/auth";
import {firebaseAuth} from "../../firebase/firebase-config";
import {useNavigate} from "react-router-dom";
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    EdgeChange,
    MiniMap,
    NodeChange,
    ReactFlow,
} from "reactflow";
import 'reactflow/dist/style.css';
import {Node, Edge} from 'reactflow';
import Navbar from '../../components/Navbar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

const deleteKeyCodes: string[] = ['Backspace', 'Delete'];

const Creator = (): JSX.Element => {
    const [isProjectSaved, setIsProjectSaved] = useState(false);
    const [isProjectOpened, setIsProjectOpened] = useState(false);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
    }, [navigate]);

    // const insertGame = async () =>
    //     fetch("https://backend.text-adventure-maker.workers.dev/games",
    //         {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 game: count,
    //             })
    //         })
    //         .then(response => response.json())
    //         .then(() => setCount(count + 1))
    //         .then(fetchGames);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    return (
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={0}
            height="100vh"
        >
            <Navbar isProjectOpened={isProjectOpened} isProjectSaved={isProjectSaved} />
            <Box
                width="100%"
                flexGrow={1}
                height="100%"
            >
                {isProjectOpened &&
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                        deleteKeyCode={deleteKeyCodes}
                    >
                        <Controls/>
                        <MiniMap/>
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                    </ReactFlow>
                }
            </Box>
        </Stack>
    );
};

export default Creator;
