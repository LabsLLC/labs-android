import React, { Component } from 'react';
import {Text, Platform, StyleSheet, View, AppRegistry, Image, ListView, Linking} from 'react-native';
import { Button } from 'react-native-elements'
import {Card} from 'react-native-elements';
import firebase from 'react-native-firebase';
import LoginUtils from '../lib/LoginUtils'
import Database from '../lib/Database'

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

    componentDidMount() {

        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) { //if user is authenticated
                //resets the navigation stack so user can't go back here
                LoginUtils.navigateLogin(this.props.navigation);

            } else {
                this.setState({ loading: false, authenticated: false });
                unsubscribe();
            }
        });
    }

    render() {
        if (this.state.loading) {
            return Main.renderLoadingView();
        }
        else
        {
            return (
                <View style={{ marginTop: 10}}>
                    <Card title='Welcome to Labs'>
                        <Button buttonStyle={styles.button}
                                borderRadius = {48}
                            onPress={this.onSignUpPress.bind(this)}
                            title="Create an account"/>
                        <Button buttonStyle={styles.button}
                                borderRadius = {48}
                                onPress={this.onLoginPress}
                                title="Log in with Facebook" />
                    </Card>
                </View>
            );
        }
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

    onLoginPress() {
        this.setState({ error: '', loading: true });
        LoginUtils.getFacebookLoginPromise()
            .then((currentUser) => {
                Database.setUserName(currentUser.uid, currentUser.displayName);

                this.setState({ error: '', loading: false });
                LoginUtils.navigateLogin(this.props.navigation);
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

            Database.setUserName(currentUser.uid, currentUser.displayName);
            //Database.setUserHomeAddress(currentUser.uid, address);rrr

            //redirect to location screen
            this.props.navigation.navigate('ChooseAddress', {currentUser: currentUser});

            this.setState({error: '', loading: false});
        })
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
    button: {
        marginVertical:8,
        backgroundColor:'#5764FE'
    }
});

module.exports = Main;
