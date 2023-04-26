import React, {useEffect, useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Divider, Text} from 'react-native-paper';
import {useColorScheme, FlatList, ListRenderItemInfo, View, RefreshControl} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StackParamList} from "../../App";

interface GameTitle {
    _id: string;
    title: string;
}

const GameList = ({navigation}: NativeStackScreenProps<StackParamList, "GameList">) => {
    const [gameTitles, setGameTitles] = useState<GameTitle[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const fetchGames = async () => {
        setRefreshing(true);
        // fetch('http://localhost:8787/games', {
        return fetch('https://backend.text-adventure-maker.workers.dev/games', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => setGameTitles(data.games))
            .then(() => setRefreshing(false));
    };

    useEffect(() => {
        fetchGames();
    }, []);

    return (
        <SafeAreaView style={backgroundStyle}>
            <FlatList
                data={gameTitles}
                renderItem={({item}: ListRenderItemInfo<GameTitle>) => (
                    <View
                        style={{flexDirection: 'column', alignItems: 'stretch', width: '100%'}}
                    >
                        <Text
                            variant='titleLarge'
                            style={{padding: 24}}
                            onPress={() => navigation.navigate('GamePlay', {gameId: item._id, gameTitle: item.title})}
                        >
                            {item.title}
                        </Text>
                        <Divider style={{borderColor: 'white', borderWidth: .7}}/>
                    </View>
                )}
                keyExtractor={item => item._id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchGames} />
                }
            />
        </SafeAreaView>
    );
};

export default GameList;
