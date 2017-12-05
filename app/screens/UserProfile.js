import React, { Component } from 'react';
import {Button, Text, Tile, SearchBar, List, ListItem} from 'react-native-elements';
import {ScrollView, Modal, StyleSheet} from 'react-native';
import {View} from 'react-native';
import Navbar from '../components/NavBar/Navbar.js'


export default class UserProfile extends Component<{}> {

    constructor(props) {
        super(props);
        //function bindings
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            searchText:'',
        };
    }

    handleChange(event) {
        this.setState({ searchText: event});
    }

    static handleClickExperiment(event){
       // console.log("Clicked List item "+event.toString())
    }

    render() {
        return (
            <View/>
        )
    }
}