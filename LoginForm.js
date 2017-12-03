import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
//import firebase from 'firebase';
import TitledInput from './TitledInput';
import Database from './Database';
import firebase from 'react-native-firebase';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

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
        LoginManager
            .logInWithReadPermissions(['public_profile', 'email'])
            .then((result) => {
                if (result.isCancelled) {
                    return Promise.reject(new Error('The user cancelled the request'));
                }

                console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
                // get the access token
                return AccessToken.getCurrentAccessToken();
            })
            .then(data => {
                // create a new firebase credential with the token
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

                // login with credential
                return firebase.auth().signInWithCredential(credential);
            })
            .then((currentUser) => {
                console.warn(JSON.stringify(currentUser.toJSON()));
                this.setState({ error: '', loading: false });
            })
            .catch((error) => {
                console.log(`Login fail with error: ${error}`);
                this.setState({ error: 'Authentication failed. Please check your credentials', loading: false });
            });

       /* firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => { this.setState({ error: '', loading: false }); })
            .catch(() => {
                        console.log(e);
                        this.setState({ error: 'Authentication failed. Please check your credentials', loading: false });
            });*/
    }

    /**
     * Action for the Sign Up Button
     */
    onSignUpPress() {
        this.setState({ error: '', loading: true });
        const { email, password, address } = this.state;
                //Login was not successful, let's create a new account
              /*  firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((user) => {
                        Database.setUserHomeAddress(user.uid, address);
                        this.setState({ error: '', loading: false });
                    })
                    .catch(() => {
                        this.setState({ error: 'Authentication failed.', loading: false });
                    });*/
    }

    /**
     * TODO: Rename to Log in
     * @returns {XML}
     */
    renderButtonOrSpinner() {
        if (this.state.loading) {
            return <Text />;
        }
        return <Button onPress={this.onLoginPress.bind(this)}
                       title="Log in"/>;
    }

    renderSignUpButton() {
        if (this.state.loading) {
            return <Text />;
        }
        return <Button onPress={this.onSignUpPress.bind(this)} title="Sign Up" />;
    }

    renderSignUpOrLogin() {
        if ('SignUp' in this.props){
            return this.renderSignUpButton()
        } else {
            return this.renderButtonOrSpinner()
        }
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
                <TitledInput
                    label='Email Address'
                    placeholder='you@domain.com'
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                />
                <TitledInput
                    label='Password'
                    autoCorrect={false}
                    placeholder='*******'
                    secureTextEntry
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                />
                {this.renderSignUp()}
                <Text style={styles.errorTextStyle}>{this.state.error}</Text>
                {this.renderSignUpOrLogin()}
            </View>
        );
    }
}
const styles = {
    errorTextStyle: {
        color: '#E64A19',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    }
};

module.exports = LoginForm;