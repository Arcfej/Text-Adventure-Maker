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
import SideToolbar from "../../components/SideToolbar";

const deleteKeyCodes: string[] = ['Backspace', 'Delete'];

const Creator = (): JSX.Element => {
    const [isProjectSaved, setIsProjectSaved] = useState<boolean>(true);
    const [openedProject, setOpenedProject] = useState<string | null>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
    }, [navigate]);

    useEffect(() => {
        setIsProjectSaved(false);
    }, [nodes, edges]);

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
            width="100vw"
        >
            <Navbar
                openedProject={openedProject}
                isProjectSaved={isProjectSaved}
                setOpenedProject={setOpenedProject}
                setIsProjectSaved={setIsProjectSaved}
                setEdges={setEdges}
                setNodes={setNodes}
            />
            <Stack
                direction="row"
                width="100%"
                justifyContent="flex-start"
                alignItems="stretch"
                spacing={0}
                flexGrow={10}
            >
                <SideToolbar
                    nodes={nodes}
                    edges={edges}
                    setNodes={setNodes}
                    setEdges={setEdges}
                />
                <Box
                    width="100%"
                    height="100%"
                    flexGrow={10}
                >
                    {openedProject !== null &&
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
        </Stack>
    );
};

export default Creator;
