import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import GameList from "./screens/GameList";
import GamePlay from "./screens/GamePlay";

export type StackParamList = {
    GameList: undefined;
    GamePlay: { gameId: string, gameTitle: string };
};

const Stack = createNativeStackNavigator<StackParamList>();

function App(): JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="GameList">
                <Stack.Screen name="GameList" component={GameList} options={{title: 'Games'}} />
                <Stack.Screen name="GamePlay" component={GamePlay} options={({route}) => ({title: route.params.gameTitle})} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
