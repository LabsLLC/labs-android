import React, { Component } from 'react';
import {Button, Text, Tile, SearchBar, List, ListItem} from 'react-native-elements';
import {Image, TouchableOpacity, ScrollView, Modal, StyleSheet, AsyncStorage} from 'react-native';
import {View} from 'react-native';
import Navbar from '../components/NavBar/Navbar.js'
import ProfilePicture from "../components/ProfilePicture/ProfilePicture";

const FBSDK = require('react-native-fbsdk');
const {
    GraphRequest,
    GraphRequestManager,
} = FBSDK;

const profileImageKey = "profileImage";

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
        AsyncStorage.getItem(profileImageKey).then((value) => {
            if(value)
            {
                this.setState({profileImage: value});
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

                AsyncStorage.setItem(profileImageKey, result.data.url);
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
                        },
                        height:
                        {
                            string: '120'
                        },
                        width:
                        {
                            string: '120'
                        }
                    }
            },
            this._responseInfoCallback,
        );

        new GraphRequestManager().addRequest(infoRequest).start();
    }

    render() {
        return (
            <View>
                <ProfilePicture profileImage={this.state.profileImage} onPress={this.fetchFbProfilePic}/>
            </View>
        )
    }
}

