
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { KeyboardAvoidingView, Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Main from './Main.js'
import ExperimentBrowse from './ExperimentBrowse.js'
import HomePage from './HomePage.js'
import { AppRegistry } from 'react-native';
import Navbar from '../components/NavBar/Navbar.js'
import UserProfile from "./UserProfile";
import Experiment from './Experiment.js';
import ChooseAddress from './ChooseAddress'

export default class App extends Component<{}> {
    render() {
        return (
            <RootNavigator />
        )}
}

const RootNavigator = StackNavigator({
    Main: {
        screen: Main,
    },
    ExperimentBrowse: {
        screen: ExperimentBrowse,
    },
    Experiment: {
        screen: Experiment,
    },
    ChooseAddress: {
        screen: ChooseAddress,
    },
    HomePage: {
        screen: HomePage,
    },
    UserProfile: {
        screen: UserProfile
    },
    Navbar: {
        screen: Navbar,
    },
}, {
    headerMode: 'none'
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);

//() => (<LoginForm SignUp={true}}/>) how to pass props
