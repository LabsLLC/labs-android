import React, { Component } from 'react';
import { Card, Text, Header } from 'react-native-elements';
import * as firebase from 'firebase';
import { Button, Platform, StyleSheet, View, AppRegistry, Image, ListView, Linking} from 'react-native';
import LoginForm from '../components/LoginForm'
import Navbar from '../components/Navbar.js'

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class Main extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
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
        return (
            <View >
                <Card
                    title='Welcome'>
                    <Button
                        onPress={() => this.props.navigation.navigate('SignUp')}
                        title="Create an account"/>
                    <LoginForm/>
                </Card>
                <Navbar navigation = {this.props.navigation}/>
            </View>
        );
    }

    static renderLoadingView() {
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

module.exports = Main;
