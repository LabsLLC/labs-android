import React, { Component } from 'react';
import {Button, Text, Tile, SearchBar, List, ListItem} from 'react-native-elements';
import {Image, ScrollView, Modal, StyleSheet,} from 'react-native';
import {View} from 'react-native';
import Navbar from '../components/NavBar/Navbar.js'

const FBSDK = require('react-native-fbsdk');
const {
    GraphRequest,
    GraphRequestManager,
} = FBSDK;

export default class UserProfile extends Component<{}> {

    constructor(props) {
        super(props);
        //function bindings
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            searchText: '',
        };
    }

    handleChange(event) {
        this.setState({searchText: event});
    }

    static handleClickExperiment(event) {
        // console.log("Clicked List item "+event.toString())
    }

    _responseInfoCallback(error: ?Object, result: ?Object) {
        if (error) {
            alert('Error fetching data: ' + error.toString());
        } else {
            alert('Success fetching data: ' + result.toString());
        }
    }

    onProfileClick()
    {
        const infoRequest = new GraphRequest(
            '/me',
            null,
            this._responseInfoCallback,
        );

        new GraphRequestManager().addRequest(infoRequest).start();
    }

    render() {
        return (
            <View>
                <TouchableOpacity>
                    <Image style={styles.image} onClick="onProfileClick" source={{uri: 'http://placehold.it/120x120'}}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        height: 120,
        borderRadius: 60,
        width: 120,
        marginTop: 48,
        alignSelf: "center",
    }
});


