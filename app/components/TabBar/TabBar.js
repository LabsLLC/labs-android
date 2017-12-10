import React, { Component } from 'react';
import { Card, Text, Header } from 'react-native-elements';
import { Button, StyleSheet, View, TouchableHighlight, TouchableOpacity, Image, ScrollView } from 'react-native';
import styles from './styles'
import Screens from '../../config/navigationNames'
import TabIcon from "../TabIcon/TabIcon";

export default class TabBar extends Component<{}> {

    constructor(props) {
        super(props);

        this.selectTab = this.selectTab.bind(this);

        console.log("Nav: " + JSON.stringify(this.props.navigation));

        this.state = {
            currentPage: ''
        }
    }

    //When an icon in the nav bar is pressed, update it's style to turn it blue
    onPressButton() {
        console.log('hi')
    }

    selectTab(screenName) {
        console.log("Select tab called");

        if(screenName!==this.state.currentPage) {
            this.setState({currentPage: screenName});

            console.log("Navigate called");
            this.props.navigation.navigate(screenName);
        }
    }

    /* <View style={styles.button} >
                        <TouchableOpacity style={{width: 30, height: 30}} onPress={() => this.selectTab(Screens.Home) }>
                            {'page' in this.props && this.props.page === "HomePage" ?
                                <Image style={{width: 30, height: 30}}
                                    source={require('../../images/navigation/HomeBlue.png')}
                                />
                                :
                                <Image style={{width: 30, height: 30}}
                                    source={require('../../images/navigation/HomeGrey.png')}
                                />
                            }
                        </TouchableOpacity>
                    </View>*/

    render() {
        return (
            <View style={{position: 'absolute', left:0, right:0, bottom:0}}>
                <View style={styles.container}>

                    <TabIcon inactive={require('../../images/navigation/HomeGrey.png')}
                             selected={require('../../images/navigation/HomeBlue.png')}
                             onPress={()=>this.selectTab(Screens.Home)}/>

                    <TabIcon inactive={require('../../images/navigation/BrowseGrey.png')}
                             selected={require('../../images/navigation/BrowseBlue.png')}
                             onPress={()=>this.selectTab(Screens.BrowseExperiments)}/>

                    <TouchableOpacity style={{width: 50, height: 50}} onPress={this._onPressButton}>
                        <Image style={{width: 50, height: 50}}
                            source={require('../../images/completeSurvey.png')}
                        />
                    </TouchableOpacity>

                    <TabIcon inactive={require('../../images/navigation/StatsGrey.png')}
                             selected={require('../../images/navigation/StatsBlue.png')}
                             onPress={()=> this.onPressButton()}/>

                    <TabIcon inactive={require('../../images/navigation/ProfileGrey.png')}
                             selected={require('../../images/navigation/ProfileBlue.png')}
                             onPress={()=> this.selectTab(Screens.UserProfile)}/>
                </View>
            </View>
        );
    }
}

module.exports = TabBar;