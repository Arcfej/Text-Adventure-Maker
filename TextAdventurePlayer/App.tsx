import React, {useEffect, useState} from 'react';
import {Appbar, Divider, Text} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
    FlatList,
    ListRenderItemInfo,
    SafeAreaView,
    useColorScheme,
    View,
} from 'react-native';

interface GameTitle {
    _id: string;
    title: string;
}

function App(): JSX.Element {
    const [gameTitles, setGameTitles] = useState<GameTitle[]>([]);
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const fetchGames = async () => {
        // fetch('http://localhost:8787/games', {
        return fetch('https://backend.text-adventure-maker.workers.dev/games', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => setGameTitles(data.games));
    };

    useEffect(() => {
        fetchGames();
    }, []);

    return (
        <SafeAreaView style={backgroundStyle}>
            <Appbar.Header>
                <Appbar.Content title="Games"/>
            </Appbar.Header>
            <FlatList
                data={gameTitles}
                renderItem={({item}: ListRenderItemInfo<GameTitle>) => (
                    <View style={{ flexDirection: 'column', alignItems: 'stretch', width: '100%'}}>
                        <Text variant='titleLarge' style={{padding: 24}}>{item.title}</Text>
                        <Divider style={{borderColor: 'white', borderWidth: .7}}/>
                    </View>
                )}
                keyExtractor={item => item._id}
            />
        </SafeAreaView>
    );
}

export default App;
