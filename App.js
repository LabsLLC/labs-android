/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Card, Button, Text, Header } from 'react-native-elements';
import * as firebase from 'firebase';
import { Platform, StyleSheet, View, AppRegistry, Image, ListView, Linking} from 'react-native';
import LoginForm from './LoginForm'




const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDw-gKR_SGlQwrK7EpC30jvl2Jx5tPIyV8",
    authDomain: "labs-c6f2f.firebaseapp.com",
    databaseURL: "https://labs-c6f2f.firebaseio.com/",
    storageBucket: "labs-c6f2f.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class App extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        };
    }

    componentDidMount(){
        this.setState({
            loaded: true
        })
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        let titleText = "Movies: "+this.state.numberOfMovies;
        return (

            <View >

                <Header
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'Labs', style: { color: '#fff' } }}
                    rightComponent={{ icon: 'home', color: '#fff' }}
                />


                <Card
                    title='HELLO USER'
                >
                    <LoginForm/>
                </Card>

            </View>
        );
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
              <Text>
                Loading awesome...
              </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleContainer: {
        textAlign: 'center',
        fontSize: 20,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    thumbnail: {
        width: 53,
        height: 81,
    },
    rightContainer: {
        flex: 1,
        backgroundColor: '#BFFCFF'
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    year: {
        textAlign: 'center',
    },
    listView: {
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
    },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);