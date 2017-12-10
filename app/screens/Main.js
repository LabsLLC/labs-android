import React, { Component } from 'react';
import {Text, Button, Platform, StyleSheet, View, AppRegistry, Image, ListView, Linking} from 'react-native';
import {Card} from 'react-native-elements';
import LoginForm from '../components/LoginForm'
import Navbar from '../components/TabBar/TabBar.js'
import firebase from 'react-native-firebase';
import BackgroundTask from 'react-native-background-task'
import { NavigationActions } from 'react-navigation'

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

    componentWillMount() {
        // This handler fires whenever bgGeo receives a location update.

    }

    componentDidMount(){

        BackgroundTask.schedule();

        // Optional: Check if the device is blocking background tasks or not
        this.checkStatus();

        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) { //if user is authenticated
                //this.props.navigation.navigate(Screens.Home);
                this.props.navigation.dispatch(NavigationActions.reset({
                    index: 0,
                    key: null,
                    actions: [NavigationActions.navigate({ routeName: Screens.Authenticated})]
                }))

            } else {
                this.setState({ loading: false, authenticated: false });
            }
        });
    }

    onLocation(location) {
        console.log('- [event] location: ', location);
    }

    async checkStatus() {
        const status = await BackgroundTask.statusAsync();

        if (status.available) {
            // Everything's fine
            return
        }

        const reason = status.unavailableReason
        if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
            Alert.alert('Denied', 'Please enable background "Background App Refresh" for this app')
        } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
            Alert.alert('Restricted', 'Background tasks are restricted on your device')
        }
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
