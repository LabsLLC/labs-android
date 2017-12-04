import React, { Component } from 'react';
import { Card, Text, Header } from 'react-native-elements';
import { Button, StyleSheet, View, TouchableHighlight, Image, ScrollView } from 'react-native';


export default class Navbar extends Component<{}> {

    constructor(props) {
        super(props);
    }

    _onPressButton() {
        console.log('hi')
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.button} >
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('HomePage')}>
                        <Image
                            source={require('./images/home.png')}
                        />
                    </TouchableHighlight>
                </View>
                <View style={styles.button} >
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('ExperimentBrowse')}>
                        <Image
                            source={require('./images/experiments.png')}
                        />
                    </TouchableHighlight>
                </View>
                <View style={styles.biggerButton} >
                    <TouchableHighlight onPress={this._onPressButton}>
                        <Image
                            source={require('./images/completeSurvey.png')}
                        />
                    </TouchableHighlight>
                </View>
                <View style={styles.button} >
                    <TouchableHighlight onPress={this._onPressButton}>
                        <Image
                            source={require('./images/stats.png')}
                        />
                    </TouchableHighlight>
                </View>
                <View style={styles.button} >
                    <TouchableHighlight onPress={this._onPressButton}>
                        <Image
                            source={require('./images/userProfile.png')}
                        />
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: 80,
        marginTop: 10,
        marginLeft: 15,
    },
    button: {
        width: 60,
        height: 60,
    },
    biggerButton: {
        width:90,
        height: 100,
    },
});

module.exports = Navbar;