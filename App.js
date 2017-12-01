
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Main from './Main.js'
import SignUp from './SignUp.js'
import { AppRegistry} from 'react-native';
import LoginForm from './LoginForm.js'


export default class App extends Component<{}> {

    render() {
        return (
            <RootNavigator />
        )}
}

const RootNavigator = StackNavigator({
    Home: {
        screen: Main,
    },
    Details: {
        screen: () => (<LoginForm SignUp={true}/>),
    },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);