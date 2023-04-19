import React, {useEffect} from 'react';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StackParamList} from "../../App";
import {Text, Button} from "react-native-paper";
import {ScrollView, View} from "react-native";

interface Node {
    id: string;
    data: any;
}

interface Edge {
    id: string;
    source: string;
    target: string;
    sourceHandle: string;
}

interface Game {
    title: string;
    graph: {
        nodes: Array<Node>,
        edges: Array<Edge>,
        startNode: string;
    }
}

type GamePlayProps = NativeStackScreenProps<StackParamList, "GamePlay">

const GamePlay = ({route}: GamePlayProps) => {
    const {gameId} = route.params;
    const [game, setGame] = React.useState<Game | null>(null);
    const [currentNode, setCurrentNode] = React.useState<Node | undefined>(undefined);

    const fetchGame = async () => {
        // fetch('http://localhost:8787/games', {
        return fetch('https://backend.text-adventure-maker.workers.dev/games/' + gameId + '/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setGame(data);
                setCurrentNode(data?.graph.nodes.find((node: Node) => node.id === data?.graph.startNode));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetchGame();
    }, []);

    return (
        <ScrollView contentContainerStyle={{margin: 16, flexGrow: 1, paddingBottom: 32}}>
            <Text variant="bodyLarge" style={{marginBottom: 8}}>{currentNode?.data.body}</Text>
            <View style={{flexGrow: 1}}/>
            {currentNode?.data.choices && currentNode?.data.choices.map((choice: any, index: number) => {
                return (
                    <Button
                        key={index}
                        mode="contained"
                        onPress={() => {
                            // TODO calculate targets on backend when publishing the game
                            const targetId = game?.graph.edges.find((edge) => {
                                if (edge.source === currentNode?.id) console.log(edge.source, edge.sourceHandle, `${index}`);
                                return edge.source === currentNode?.id && edge.sourceHandle === `${index}`;
                            })?.target;
                            if (targetId) setCurrentNode(game?.graph.nodes.find((node) => node.id === targetId));
                        }}
                        style={{margin: 8}}
                    >
                        {choice}
                    </Button>
                );
            })}
        </ScrollView>
    );
};

export default GamePlay;
