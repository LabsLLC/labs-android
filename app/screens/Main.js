import React, { Component } from 'react';
import {Text, Button, Platform, StyleSheet, View, AppRegistry, Image, ListView, Linking} from 'react-native';
import {Card} from 'react-native-elements';
import Navbar from '../components/NavBar/Navbar.js'
import firebase from 'react-native-firebase';
import LoginUtils from '../lib/LoginUtils'

import Screens from '../config/navigationNames'

export default class Main extends Component<{}> {

    constructor() {
        super();

        this.onLoginPress = this.onLoginPress.bind(this);
        this.onSignUpPress = this.onSignUpPress.bind(this);

        this.state = {
            loading: true,
            authenticated: false,
            error: '',
        };
    }

    componentDidMount(){

        var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) { //if user is authenticated
                this.props.navigation.navigate(Screens.Home);
            } else {
                this.setState({ loading: false, authenticated: false });
                unsubscribe();
            }
        });
    }

    onLoginPress() {
        this.setState({ error: '', loading: true });
        LoginUtils.getFacebookLoginPromise()
            .then((currentUser) => {
                this.setState({ error: '', loading: false });
                this.props.navigation.navigate('HomePage');
            })
            .catch((error) => {
                console.log(`Login fail with error: ${error}`);
                this.setState({ error: 'Authentication failed. Please check your credentials', loading: false });
            });
    }

    /**
     * Action for the Sign Up Button
     */
    onSignUpPress() {
        console.log("onSignUpPress");
        this.setState({error: '', loading: true});
        LoginUtils.getFacebookLoginPromise().then((currentUser) => {
            console.log("Has signed in now redirect with user: "+currentUser);

            //Database.setUserHomeAddress(currentUser.uid, address);rrr

            //redirect to location screen
            this.props.navigation.navigate('ChooseAddress', {currentUser: currentUser});

            this.setState({error: '', loading: false});
        })
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
                            onPress={this.onSignUpPress.bind(this)}
                            title="Create an account"/>
                        <Button onPress={this.onLoginPress}
                                title="Log in with Facebook" />
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
