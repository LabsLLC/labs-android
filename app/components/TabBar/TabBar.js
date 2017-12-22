import React, { Component } from 'react';
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
            currentPage: Screens.Home //this is a little bit hacky.. assumes initial page is home (but safe assumption)
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
            this.props.navigation.navigate(screenName);
        }
    }

    render() {
        return (
            <View style={styles.tabBarAnchor}>
                <View style={styles.container}>

                    <TabIcon isActive={this.state.currentPage===Screens.Home}
                             inactiveIcon={require('../../images/navigation/HomeGrey.png')}
                             selectedIcon={require('../../images/navigation/HomeBlue.png')}
                             onPress={()=>this.selectTab(Screens.Home)}/>

                    <TabIcon isActive={this.state.currentPage===Screens.BrowseExperiments}
                             inactiveIcon={require('../../images/navigation/BrowseGrey.png')}
                             selectedIcon={require('../../images/navigation/BrowseBlue.png')}
                             onPress={()=>this.selectTab(Screens.BrowseExperiments)}/>

                    <View style={{width:50, height:50}}/>

                    <TabIcon isActive={this.state.currentPage===Screens.Stats}
                             inactiveIcon={require('../../images/navigation/StatsGrey.png')}
                             selectedIcon={require('../../images/navigation/StatsBlue.png')}
                             onPress={()=> this.selectTab(Screens.Stats)}/>

                    <TabIcon isActive={this.state.currentPage===Screens.UserProfile}
                             inactiveIcon={require('../../images/navigation/ProfileGrey.png')}
                             selectedIcon={require('../../images/navigation/ProfileBlue.png')}
                             onPress={()=> this.selectTab(Screens.UserProfile)}/>
                </View>

                <TouchableOpacity style={styles.centerIcon}
                                  onPress={this._onPressButton}>
                    <Image style={styles.centerIconSize}
                           source={require('../../images/completeSurvey.png')}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

module.exports = TabBar;