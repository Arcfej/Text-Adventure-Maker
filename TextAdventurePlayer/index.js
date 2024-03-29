import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider as PaperProvider } from 'react-native-paper';

const RootComponent = () => (
    <PaperProvider>
        <App/>
    </PaperProvider>
);

AppRegistry.registerComponent(appName, () => RootComponent);
