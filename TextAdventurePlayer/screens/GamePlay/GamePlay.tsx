import React from 'react';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StackParamList} from "../../App";
import {Text} from "react-native-paper";

type GamePlayProps = NativeStackScreenProps<StackParamList, "GamePlay">

const GamePlay = ({route}: GamePlayProps) => {
    const {gameId} = route.params;

    return (
        <Text>{gameId}</Text>
    );
};

export default GamePlay;
