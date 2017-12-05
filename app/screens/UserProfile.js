import React, { Component } from 'react';
import {Button, Text, Tile, SearchBar, List, ListItem} from 'react-native-elements';
import {Image, TouchableOpacity, ScrollView, Modal, StyleSheet, AsyncStorage} from 'react-native';
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
        this._responseInfoCallback = this._responseInfoCallback.bind(this);

        this.state = {
            searchText: '',
            profileImage: 'http://placehold.it/120x120',
        };
    }

    componentDidMount()
    {
        AsyncStorage.getItem("profileImage").then((value) => {
            if(value)
            {
                this.setState({"profileImage": value});
            }
        }).done();

        //in case the facebook profile picture has been updated, go fetch it
        this.fetchFbProfilePic()
    }

    handleChange(event) {
        this.setState({searchText: event});
    }

    _responseInfoCallback(error: ?Object, result: ?Object) {
        if (error) {
           // alert('Error fetching data: ' + error.toString());
            console.error('Error fetching data');
        } else {

            if(this.state.profileImage !== result.data.url)
            {
                this.setState({
                    profileImage: result.data.url
                });

                AsyncStorage.setItem("profileImage", result.data.url);
            }

            //alert('Success fetching data: ' + result.toString());
        }

        console.log(result);
    }

    fetchFbProfilePic()
    {
        const infoRequest = new GraphRequest(
            "/me/picture",
            {
                parameters:
                    {
                        type: {
                            string: 'large'
                        },
                        redirect: /* if not specified, an image (non-json) rather than the url is returned */
                        {
                            string: 'false'
                        }
                    }
            },
            this._responseInfoCallback,
        );

        new GraphRequestManager().addRequest(infoRequest).start();
    }

    onProfileClick()
    {
        this.fetchFbProfilePic();
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.onProfileClick()}>
                    <Image style={styles.image} onClick="onProfileClick" source={{uri: this.state.profileImage}}/>
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


