import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  Text,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

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
      <FlatList
        data={games}
        renderItem={({item}: ListRenderItemInfo<Game>) => {
          console.log(item);
          return <Text>{item.intro}</Text>;
        }}
      />
    </SafeAreaView>
  );
}

export default App;
