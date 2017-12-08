import React, { Component } from 'react';
import {Button, Text} from 'react-native-elements';
import {TextInput, KeyboardAvoidingView, AsyncStorage} from 'react-native';
import {View} from 'react-native';
import Navbar from '../components/NavBar/Navbar.js'
import ProfilePicture from "../components/ProfilePicture/ProfilePicture";
import firebase from 'react-native-firebase';
import { TextField } from 'react-native-material-textfield';
import Database from "../lib/Database"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNGooglePlacePicker from 'react-native-google-place-picker';

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

        this.pickHomeLocation = this.pickHomeLocation.bind(this);

        this.state = {
            searchText: '',
            profileImage: 'http://placehold.it/120x120',
            user: firebase.auth().currentUser,
            name: firebase.auth().currentUser.displayName,
            email: firebase.auth().currentUser.email,
            phone: '',

        };

        RNGooglePlacePicker.setApiKey(Secrets.GoogleApiSecret)
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

    pickHomeLocation()
    {
        RNGooglePlacePicker.show((response) => {
            if (response.didCancel) {
                console.log('User cancelled GooglePlacePicker');
            }
            else if (response.error) {
                console.log('GooglePlacePicker Error: ', response.error);
            }
            else {
                console.log(response)
            }
        })
    }

    render() {
        let { phone } = this.state;
        return (
            <KeyboardAwareScrollView enableOnAndroid={true}>
            <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <ProfilePicture profileImage={this.state.profileImage} onPress={this.pickHomeLocation}/>
                    <Text style={{marginTop:16, fontSize: 24, fontWeight: "300"}}>{this.state.name}</Text>
                    <Text style={{marginTop:4, fontSize: 14, fontWeight: "300"}}>{this.state.email}</Text>
                    <TextField label='Home Address' value="" onChangeText={ (address) => Database.setUserHomeAddress({ address })}/>
                    <TextInput
                        style={styles.textInput}
                        placeholder="lol"
                        defaultValue="O"
                    />


                </View>
            </View>
            </KeyboardAwareScrollView>
        )
    }
}

