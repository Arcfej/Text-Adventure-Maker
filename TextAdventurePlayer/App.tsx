import React, {useEffect, useState} from 'react';
import {Appbar, List} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  useColorScheme,
} from 'react-native';

interface Game {
  intro: string;
  owner: string;
  _id: string;
}

function App(): JSX.Element {
  const [games, setGames] = useState<Game[]>([]);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const fetchGames = async () =>
    fetch('https://backend.text-adventure-maker.workers.dev/games', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setGames(data));

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <Appbar.Header>
        <Appbar.Content title="Games" />
      </Appbar.Header>
      <FlatList
        data={games}
        renderItem={({item}: ListRenderItemInfo<Game>) => (
          <List.Item title={item.intro} />
        )}
      />
    </SafeAreaView>
  );
}

export default App;
