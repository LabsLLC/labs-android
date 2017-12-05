import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import TitledInput from './TitledInput/TitledInput';
import Database from '../lib/Database';
import firebase from 'react-native-firebase';
import LoginUtils from '../lib/LoginUtils'

class LoginForm extends Component {
    state = {
        email: '',
        password: '',
        address: '',
        error: '',
        loading: false };

    onLoginPress() {
        this.setState({ error: '', loading: true });
        const { email, password, address } = this.state;
        LoginUtils.getFacebookLoginPromise()
            .then((currentUser) => {
                this.setState({ error: '', loading: false });
            })
            .then(Database.experimentTest())
            .catch((error) => {
                console.log(`Login fail with error: ${error}`);
                this.setState({ error: 'Authentication failed. Please check your credentials', loading: false });
            });
    }

    /**
     * Action for the Sign Up Button
     */
    onSignUpPress() {
        this.setState({ error: '', loading: true });
        const { email, password, address } = this.state;

        LoginUtils.getFacebookLoginPromise().then((currentUser) => {
            Database.setUserHomeAddress(currentUser.uid, address);
            this.setState({ error: '', loading: false });
        })
        .then(() => {
            console.log("Here");
            Database.experimentTest()} );
    }

    /**
     * TODO: Rename to Log in
     * @returns {XML}
     */
    renderButtonOrSpinner() {
        if (this.state.loading) {
            return <Text />;
        }
        return <View style={styles.loginButtonStyle}>
                    <Button onPress={this.onLoginPress.bind(this)}
                             title="Log in with Facebook"/>
                </View>;
    }

    renderSignUpButton() {
        if (this.state.loading) {
            return <Text />;
        }
        return <Button  onPress={this.onSignUpPress.bind(this)} title="Sign Up" />;
    }

    renderSignUp() {
        if('SignUp' in this.props){
            return <TitledInput
                label='Home Address'
                autoCorrect={false}
                placeholder='100 Institute Rd, Worcester, MA'
                value={this.state.address}
                onChangeText={address => this.setState({ address })}
            />;
        }
    }

    render() {
        return (
            <View>
                {this.renderSignUp()}
                {this.renderSignUpButton()}
            </View>
        );
    }
}
const styles =  StyleSheet.create({
    errorTextStyle: {
        color: '#E64A19',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    loginButtonStyle:
    {
        marginTop: 20
    },
});

module.exports = LoginForm;