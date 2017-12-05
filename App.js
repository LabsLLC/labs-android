
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Main from './Main.js'
import SignUp from './SignUp.js'
import ExperimentBrowse from './ExperimentBrowse.js'
import HomePage from './HomePage.js'
import { AppRegistry, ScrollView, View} from 'react-native';
import Navbar from './Navbar.js'
import Experiment from './Experiment.js'

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
    SignUp: {
        screen: SignUp,
    },
    ExperimentBrowse: {
        screen: ExperimentBrowse,
    },
    Experiment: {
        screen: Experiment,
    },
    HomePage: {
        screen: HomePage,
    },
    Navbar: {
        screen: Navbar,
    },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);

//() => (<LoginForm SignUp={true}}/>) how to pass props