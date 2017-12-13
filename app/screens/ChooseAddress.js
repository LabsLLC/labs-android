import React, { Component } from 'react';
import {Text, Platform, StyleSheet, View, AppRegistry, Image, ListView, Linking} from 'react-native';
import { Button } from 'react-native-elements'
import RNGooglePlaces from 'react-native-google-places';
import Database from '../lib/Database';


/*const instance = firebase.initializeApp({
    persistence: true
});*/

export default class ChooseAddress extends Component<{}> {

    constructor(props) {
        super(props);

        this.pickHomeLocation = this.pickHomeLocation.bind(this);


        this.state = {
            address: 'No address yet',
            error: '',
            loading: false
        };
    }


    pickHomeLocation() {
        RNGooglePlaces.openPlacePickerModal()
            .then((place) => {
                console.log(place);
                let newAddress = place.address.replace(/"/g,"");

                Database.setUserHomeAddress(this.props.navigation.state.params.currentUser.uid,  newAddress);

                LoginUtils.navigateLogin(this.props.navigation);

            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }

    render() {
        //console.log("GOT PROPS?: "+JSON.stringify(this.props.navigation.state.params.currentUser));
       // console.log("GOT PROPS?: "+JSON.stringify(this.props.navigation.state.params.currentUser.uid));

        return (
            <View style={styles.container}>

                <Text style={styles.textTitle}>Intelligent Reminders</Text>

                <Text style={styles.text}>Get reminders to complete your goal when you get home each day</Text>

                <Image style={styles.image}
                       source={require('../images/HomeLocation.png')}/>

                <Button buttonStyle={styles.button}
                        textStyle={styles.buttonText}
                        title="  Set your address  "
                        borderRadius = {48}
                        onPress={this.pickHomeLocation} >
                </Button>

                <Text style={styles.skipText}>Skip</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5764fe',
    },
    innerContainer: {
        margin: 30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        color: 'white',
        paddingHorizontal:24,
        paddingTop:56,
        fontSize: 28,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    text: {
        color: 'white',
        fontSize: 18,
        paddingHorizontal:44,
        textAlign:'left',
        alignItems:'center',
        marginTop: 20
    },
    image: {
        width: 177,
        height: 170,
        marginTop: 60,
        alignSelf: 'center',
    },
    button: {
        backgroundColor: 'white',
        marginHorizontal:44,
        marginTop:64
    },
    buttonText: {
        color: '#5764fe',
        fontWeight: 'bold',
        fontSize: 20
    },
    skipText: {
        color: 'white',
        textDecorationLine: 'underline',
        fontSize: 18,
        marginTop:16,
        alignSelf:'center'
    }
});

module.exports = ChooseAddress;
