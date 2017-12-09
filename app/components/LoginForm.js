import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Database from '../lib/Database';
import LoginUtils from '../lib/LoginUtils'
import SettingDetail from './SettingDetail/SettingDetail';
import RNGooglePlaces from 'react-native-google-places';


class LoginForm extends Component {


    constructor(props) {
        super(props);

        //function bindings
        this.pickHomeLocation = this.pickHomeLocation.bind(this);
        this.renderSignUp = this.renderSignUp.bind(this);

        this.state = {
            address: 'No address yet',
            error: '',
            loading: false
        };
    }


    pickHomeLocation()
    {
        RNGooglePlaces.openPlacePickerModal()
            .then((place) => {
                console.log(place);
                let newAddress = place.address.replace(/"/g,"");

                Database.setUserHomeAddress(this.state.user.uid, newAddress);

                this.setState({address: newAddress});
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object

    }

    /*
    state = {
        address: '',
        error: '',
        loading: false };*/

    onLoginPress() {
        this.setState({ error: '', loading: true });
            LoginUtils.getFacebookLoginPromise()
            .then((currentUser) => {
                this.setState({ error: '', loading: false });
            })
            .then(() => {Database.experimentTest()})
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
        const {address} = this.state;
        LoginUtils.getFacebookLoginPromise().then((currentUser) => {
            console.log("Has signed in now redirect");

            //Database.setUserHomeAddress(currentUser.uid, address);

            //redirect to location screen
            this.props.navigation.navigate('ChooseAddress', {currentUser: currentUser})

            this.setState({error: '', loading: false});
        })
    }



    renderLogin() {
        if (this.state.loading) {
            return <View style={styles.loginButtonStyle}>
                <Button onPress={this.onLoginPress.bind(this)}
                        title="Log in with Facebook"
                        disabled/>
            </View>;
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
        return <Button onPress={this.onSignUpPress.bind(this)} title="Sign Up" />;
    }

    renderSignUp() {
        if('SignUp' in this.props){
            return <SettingDetail onPress={this.pickHomeLocation}
                                   title="Home Address"
                                   content={this.state.address}/>


        }
    }

    render() {
        return (
            <View>
                {this.renderSignUp()}
                {this.renderLogin()}
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