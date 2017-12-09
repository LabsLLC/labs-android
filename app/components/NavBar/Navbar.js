import React, { Component } from 'react';
import { Card, Text, Header } from 'react-native-elements';
import { Button, StyleSheet, View, TouchableHighlight, Image, ScrollView } from 'react-native';
import styles from './styles'

export default class Navbar extends Component<{}> {

    constructor(props) {
        super(props);
    }

    //When an icon in the nav bar is pressed, update it's style to turn it blue
    onPressButton() {
        console.log('hi')
    }

    render() {
        return (



            <View style={styles.container}>

                <View style={styles.button} >
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('HomePage')}>
                        {'page' in this.props && this.props.page === "HomePage" ?
                            <Image style={{width: 30, height: 30}}
                                source={require('../../images/navigation/HomeBlue.png')}
                            />
                            :
                            <Image style={{width: 30, height: 30}}
                                source={require('../../images/navigation/HomeGrey.png')}
                            />
                        }

                    </TouchableHighlight>
                </View>

                <View style={styles.button} >
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('ExperimentBrowse')}>
                        {'page' in this.props && this.props.page === "Browse" ?
                            <Image style={{width: 30, height: 30}}
                                source={require('../../images/navigation/BrowseBlue.png')}
                            />
                            :
                            <Image style={{width: 30, height: 30}}
                                source={require('../../images/navigation/BrowseGrey.png')}
                            />
                        }
                    </TouchableHighlight>
                </View>

                <View style={styles.biggerButton} >
                    <TouchableHighlight onPress={this._onPressButton}>
                        <Image style={{width: 50, height: 50}}
                            source={require('../../images/completeSurvey.png')}
                        />
                    </TouchableHighlight>
                </View>

                <View style={styles.button} >
                    <TouchableHighlight onPress={this._onPressButton}>
                        {'page' in this.props && this.props.page === "Stats" ?
                            <Image style={{width: 30, height: 30}}
                                source={require('../../images/navigation/StatsBlue.png')}
                            />
                            :
                            <Image style={{width: 30, height: 30}}
                                source={require('../../images/navigation/StatsGrey.png')}
                            />
                        }
                    </TouchableHighlight>
                </View>

                <View style={styles.button} >
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('UserProfile')}>
                        {'page' in this.props && this.props.page === "Profile" ?
                            <Image style={{width: 30, height: 30}}
                                source={require('../../images/navigation/ProfileBlue.png')}
                            />
                            :
                            <Image style={{width: 30, height: 30}}
                                source={require('../../images/navigation/ProfileGrey.png')}
                            />
                        }
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

module.exports = Navbar;