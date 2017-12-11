import React, { Component } from 'react';
import {Text, Platform, StyleSheet, View, AppRegistry, Image, ListView, Linking} from 'react-native';
import { Button } from 'react-native-elements'
import RNGooglePlaces from 'react-native-google-places';
import Database from '../lib/Database';


/*const instance = firebase.initializeApp({
    persistence: true
});*/

export default class ExperimentComplete extends Component<{}> {

    constructor(props) {
        super(props);



        this.state = {
            address: 'No address yet',
            error: '',
            loading: false
        };
    }



    render() {
        //console.log("GOT PROPS?: "+JSON.stringify(this.props.navigation.state.params.currentUser));
        // console.log("GOT PROPS?: "+JSON.stringify(this.props.navigation.state.params.experiment));
        //
        // var experiment_name = ''
        // if(this.props.navigation.state.params.experiment && 'name' in this.props.navigation.state.params.experiment)
        //     experiment_name = this.props.navigation.state.params.experiment.name;

        return (
            <View style={styles.container}>

                <View style={styles.innerContainer}>

                    <Text style={styles.textTitle}>Congratulations</Text>

                    <Text style={styles.text}>You've successfully completed {'hi'}</Text>

                    <Image style={styles.image}
                           source={require('../images/confetti.png')}
                    />

                    <Button buttonStyle={styles.button}
                            textStyle={styles.buttonText}
                            title=" Nice! "
                            borderRadius = {48}
                            onPress={() => this.props.navigation.navigate("HomePage")} >

                    </Button>


                </View>
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
        fontSize: 34,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    text: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20
    },
    image: {
        width: 80,
        height: 80,
        marginTop: 40
    },
    button: {
        backgroundColor: 'white',
        margin: 40
    },
    buttonText: {
        color: '#5764fe',
        fontWeight: 'bold'
    },
    skipText: {
        color: 'white',
        textDecorationLine: 'underline',
        fontSize: 20,
    }
});

module.exports = ExperimentComplete;
