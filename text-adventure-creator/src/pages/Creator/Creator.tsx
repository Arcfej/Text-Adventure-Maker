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
import {initialEdges, initialNodes} from "../../components/LightDarkToggle/initalGraph";

const deleteKeyCodes: string[] = ['Backspace', 'Delete'];

function Creator(): JSX.Element {
    const navigate = useNavigate();
    const [games, setGames] = useState<Array<{ key: string, value: string }>>([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
    }, [navigate]);

    const fetchGames = async () =>
        fetch("https://backend.text-adventure-maker.workers.dev/games",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(response => response.json())
            .then(data => setGames(data));

    useEffect(() => {
        fetchGames();
    }, []);

    const insertGame = async () =>
        fetch("https://backend.text-adventure-maker.workers.dev/games",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    game: count,
                })
            })
            .then(response => response.json())
            .then(() => setCount(count + 1))
            .then(fetchGames);

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

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
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                deleteKeyCode={deleteKeyCodes}
            >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}

export default Creator;
