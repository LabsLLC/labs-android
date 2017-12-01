import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Main from './Main.js'
import SignUp from './SignUp'

const HomeScreen = () => (
    <Main />
);

const DetailsScreen = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
    </View>
);

const RootNavigator = StackNavigator({
    Home: {
        screen: Main,
    },
    Details: {
        screen: SignUp,
    },
});

export default RootNavigator;
