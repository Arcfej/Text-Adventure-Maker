import React, {useCallback, useEffect, useRef, useState} from 'react';
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
    ControlProps,
    EdgeChange,
    MiniMap,
    MiniMapProps,
    NodeChange,
    OnConnectStartParams,
    ReactFlow,
    ReactFlowProvider,
    useReactFlow,
} from "reactflow";
import 'reactflow/dist/style.css';
import {Node, Edge} from 'reactflow';
import Navbar from '../../components/Navbar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import SideToolbar from "../../components/SideToolbar";
import SceneEditor from "../../components/SceneEditor";
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import nodeTypes from '../../components/node-types/node-types';
import {HandleType} from 'reactflow';
import {styled} from '@mui/material/styles';

const deleteKeyCodes: string[] = ['Backspace', 'Delete'];

const StyledControls = styled(Controls)<ControlProps>(({theme}) => {
    const isLight = theme.palette.mode === 'light';
    return {
        button: {
            backgroundColor: isLight ? theme.palette.grey["50"] : theme.palette.grey["700"],
            color: isLight ? theme.palette.grey["900"] : theme.palette.common.white,
            borderBottom: `1px solid ${isLight ? theme.palette.grey["300"] : theme.palette.grey["600"]}`,
            '&:hover': {
                backgroundColor: isLight ? theme.palette.grey["200"] : theme.palette.grey["700"],
            },
            path: {
                fill: 'currentColor',
            },
        },
    };
});

const StyledMiniMap = styled(MiniMap)<MiniMapProps>(({theme}) => {
    const isLight = theme.palette.mode === 'light';
    return {
        backgroundColor: isLight ? theme.palette.common.white : theme.palette.common.black,
        '.react-flow__minimap-mask': {
            fill: isLight ? theme.palette.grey["300"] : theme.palette.grey["800"],
            opacity: 0.5,
        },
        '.react-flow__minimap-node': {
            fill: isLight ? theme.palette.grey["400"] : theme.palette.grey["700"],
            stroke: 'none'
        }
    }
});

const Creator = (): JSX.Element => {
    const [isProjectSaved, setIsProjectSaved] = useState<boolean>(true);
    const [openedProject, setOpenedProject] = useState<string | null>(null);
    const [projectTitle, setProjectTitle] = useState<string>('');
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [idCounter, setIdCounter] = useState<number>(0);
    const [user, setUser] = useState<string | null>(null);
    const [sceneEditorOpen, setSceneEditorOpen] = useState<boolean>(false);
    const [editedNode, setEditedNode] = useState<Node | null>(null);

    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const connectingNodeId = useRef<string>('');
    const connectingNodePort = useRef<string | null>(null);
    const connectingNodeType = useRef<HandleType>('source');
    const {project: reactFlow} = useReactFlow();

    const navigate = useNavigate();
    // If user logged out, clear local storage and redirect to login page
    // Else, save the user's email to local storage and read any previous saved state back
    useEffect(() => {
        return onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) {
                try {
                    localStorage.clear();
                } catch (e) {
                    console.warn("Problems with local storage", e);
                } finally {
                    navigate("/login");
                }
            } else {
                try {
                    setUser(currentUser.email);
                    localStorage.setItem('user', JSON.stringify(currentUser.email));
                    const openedProject = localStorage.getItem('openedProject');
                    const projectTitle = localStorage.getItem('projectTitle');
                    const isProjectSaved = localStorage.getItem('isProjectSaved');
                    const savedNodes = localStorage.getItem('nodes');
                    const savedEdges = localStorage.getItem('edges');
                    const savedIdCounter = localStorage.getItem('idCounter');
                    if (openedProject !== null) setOpenedProject(openedProject);
                    if (projectTitle !== null) setProjectTitle(projectTitle);
                    if (isProjectSaved !== null) setIsProjectSaved(isProjectSaved === 'true');
                    if (savedNodes !== null) setNodes(JSON.parse(savedNodes));
                    if (savedEdges !== null) setEdges(JSON.parse(savedEdges));
                    if (savedIdCounter !== null) setIdCounter(parseInt(savedIdCounter));
                } catch (e) {
                    console.warn("Problems with local storage", e);
                }
            }
        });
    }, [navigate]);

    // Set the project state to unsaved when the nodes or edges change
    useEffect(() => {
        setIsProjectSaved(false);
    }, [nodes, edges]);

    // TODO debounce writing to local storage when performance issues arise
    // Save the editor's state to local storage when it changes
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('openedProject', openedProject !== null ? openedProject : '');
            }
            setSceneEditorOpen(false);
        } catch (e) {
            console.warn("Problems with local storage", e);
        }
    }, [openedProject, user]);
    useEffect(() => {
        try {
            if (user) localStorage.setItem('projectTitle', projectTitle);
        } catch (e) {
            console.warn("Problems with local storage", e);
        }
    }, [projectTitle, user]);
    useEffect(() => {
        try {
            if (user) localStorage.setItem('isProjectSaved', isProjectSaved.toString());
        } catch (e) {
            console.warn("Problems with local storage", e);
        }
    }, [isProjectSaved, user]);
    useEffect(() => {
        try {
            if (user) localStorage.setItem('nodes', JSON.stringify(nodes));
        } catch (e) {
            console.warn("Problems with local storage", e);
        }
    }, [nodes, user]);
    useEffect(() => {
        try {
            if (user) localStorage.setItem('edges', JSON.stringify(edges));
        } catch (e) {
            console.warn("Problems with local storage", e);
        }
    }, [edges, user]);
    useEffect(() => {
        try {
            if (user) localStorage.setItem('idCounter', idCounter.toString());
        } catch (e) {
            console.warn("Problems with local storage", e);
        }
    }, [idCounter, user]);

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

    const getId = useCallback((): string => {
        try {
            return `${idCounter}`;
        } finally {
            setIdCounter(idCounter + 1);
        }
    }, [idCounter]);

    const onConnectStart = useCallback((_: any, {nodeId, handleId, handleType}: OnConnectStartParams) => {
        connectingNodeId.current = nodeId as string;
        connectingNodePort.current = handleId;
        connectingNodeType.current = handleType as HandleType;
    }, []);

    const onConnectEnd = useCallback(
        (event: MouseEvent | TouchEvent) => {
            const targetIsPane = (event.target as HTMLElement).classList.contains('react-flow__pane');

            if (targetIsPane) {
                // we need to remove the wrapper bounds, in order to get the correct position
                const { top, left } = reactFlowWrapper.current!.getBoundingClientRect();
                const id = getId();
                // we are removing the half of the node width (75) to center the new node
                const position = 'touches' in event
                    ? reactFlow({ x: event.touches[0].clientX - left - 75, y: event.touches[0].clientY - top })
                    : reactFlow({ x: event.clientX - left - 75, y: event.clientY - top });
                const newNode = {
                    id,
                    position: position,
                    data: {
                        label: `Scene ${id}`,
                        ...(connectingNodeType.current === 'target' && {choices: ['']}),
                    },
                    type: 'choice'
                };
                const source = connectingNodeType.current === 'source' ? connectingNodeId.current : id;
                const target = connectingNodeType.current === 'source' ? id : connectingNodeId.current;
                const newEdge = {
                    id: `${source}${connectingNodePort ? ('.' + connectingNodePort) : ''}-${target}`,
                    source: source,
                    target: target,
                    ...(connectingNodePort) && {sourceHandle: connectingNodePort.current}
                };

                setNodes((nds) => nds.concat(newNode));
                setEdges((eds) => eds.concat(newEdge));
            }
        },
        [getId, reactFlow]
    );

    const onNodeClick = useCallback(
        (event: React.MouseEvent, node: Node) => {
            setSceneEditorOpen(true);
            setEditedNode(node);
        },
        [setSceneEditorOpen]
    );

    const onPaneClick = useCallback(
        () => {
            setSceneEditorOpen(false);
            setEditedNode(null);
        },
        [setSceneEditorOpen]
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
                edges={edges}
                nodes={nodes}
                setEdges={setEdges}
                setNodes={setNodes}
                idCounter={idCounter}
                setIdCounter={setIdCounter}
                projectTitle={projectTitle}
                setProjectTitle={setProjectTitle}
            />
            <Stack
                direction="row"
                width="100%"
                justifyContent="flex-start"
                alignItems="stretch"
                spacing={0}
                flexGrow={10}
            >
                {/*<SideToolbar*/}
                {/*    nodes={nodes}*/}
                {/*    edges={edges}*/}
                {/*    setNodes={setNodes}*/}
                {/*    setEdges={setEdges}*/}
                {/*/>*/}
                <Box
                    ref={reactFlowWrapper}
                    width="100%"
                    height="100%"
                    flexGrow={10}
                >
                    {openedProject !== null &&
                        <ReactFlow
                            nodeTypes={nodeTypes}
                            nodes={nodes}
                            edges={edges}
                            onNodeClick={onNodeClick}
                            onPaneClick={onPaneClick}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onConnectStart={onConnectStart}
                            onConnectEnd={onConnectEnd}
                            fitView
                            deleteKeyCode={deleteKeyCodes}
                            onNodesDelete={() => setSceneEditorOpen(false)}
                        >
                            <Paper
                                variant="outlined"
                                square
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    zIndex: 10,
                                    py: 1,
                                    px: 2,
                                    borderBottomRightRadius: 2,
                                    boxShadow: 2
                                }}
                            >
                                <Typography variant="h6" sx={{fontWeight: 600}}>{projectTitle}</Typography>
                            </Paper>
                            <StyledControls />
                            <StyledMiniMap />
                            <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                            {sceneEditorOpen &&
                                <SceneEditor editedNode={editedNode} nodes={nodes} setNodes={setNodes} setEdges={setEdges}/>
                            }
                        </ReactFlow>
                    }
                </Box>
            </Stack>
        </Stack>
    );
};

const CreatorWithFlowProvider = (): JSX.Element => (
    <ReactFlowProvider>
        <Creator/>
    </ReactFlowProvider>
);

export default CreatorWithFlowProvider;
