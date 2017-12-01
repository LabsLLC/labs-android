import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import firebase from 'firebase';
import TitledInput from './TitledInput';
import Database from './Database';

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
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => { this.setState({ error: '', loading: false }); })
            .catch(() => {
                        console.log(e);
                        this.setState({ error: 'Authentication failed. Please check your credentials', loading: false });
            });
    }

    /**
     * Action for the Sign Up Button
     */
    onSignUpPress() {
        this.setState({ error: '', loading: true });
        const { email, password, address } = this.state;
                //Login was not successful, let's create a new account
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((user) => {
                        Database.setUserHomeAddress(user.uid, address);
                        this.setState({ error: '', loading: false });
                    })
                    .catch((e) => {
                        console.log(e);
                        this.setState({ error: 'Authentication failed.', loading: false });
                    });
    }
    renderButtonOrSpinner() {
        if (this.state.loading) {
            return <Text />;
        }
        return <Button onPress={this.onLoginPress.bind(this)} title="Log in" />;
    }

    renderSignUpButton() {
        if (this.state.loading) {
            return <Text />;
        }
        return <Button onPress={this.onLoginPress.bind(this)} title="Log in" />;
    }

    renderSignUpOrLogin() {
        if ('SignUp' in this.props){
            console.log('here')
        } else {
            console.log('not here')
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

// {this.props.SignUp ?
//     ( <View> <TitledInput
//         label='Home Address'
//         autoCorrect={false}
//         placeholder='95 Dennis Street, Worcester, Mass.'
//         // value={this.state.password}
//         onChangeText={address => this.setState({ address })}
//     />
//         {this.renderSignUpButton()}
//     </View>)
//     : <View> {this.renderButtonOrSpinner()} </View>
//
// }