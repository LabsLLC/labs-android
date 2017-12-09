import React, { Component } from 'react';
import {Text, Button, Platform, StyleSheet, View, AppRegistry, Image, ListView, Linking} from 'react-native';
import {Card} from 'react-native-elements';
import LoginForm from '../components/LoginForm'
import Navbar from '../components/NavBar/Navbar.js'
import firebase from 'react-native-firebase';

import Screens from '../config/navigationNames'

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

/*const instance = firebase.initializeApp({
    persistence: true
});*/

export default class Main extends Component<{}> {

    constructor() {
        super();

        this.state = {
            loading: true,
            authenticated: false,
        };
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) { //if user is authenticated
                this.props.navigation.navigate(Screens.Home);
            } else {
                this.setState({ loading: false, authenticated: false });
            }
        });
    }

    render() {
        if (this.state.loading) {
            return this.renderLoadingView();
        }
        else
        {
            return (
                <View style={{ marginTop: 10}}>
                    <Card title='Welcome'>
                        <Button
                            onPress={() => this.props.navigation.navigate('SignUp')}
                            title="Create an account"/>
                        <LoginForm />
                    </Card>
                    <Navbar navigation = {this.props.navigation}/>
                </View>
            );
        }
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text>
                    Loading something great...
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});

module.exports = Main;
