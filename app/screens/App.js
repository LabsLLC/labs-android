
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { KeyboardAvoidingView, Component } from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import {StyleSheet} from 'react-native';
import Main from './Main.js'
import ExperimentBrowse from './ExperimentBrowse.js'
import HomePage from './HomePage.js'
import { AppRegistry, ScrollView, View} from 'react-native';
import TabBar from '../components/TabBar/TabBar.js'
import UserProfile from "./UserProfile";
import Experiment from './Experiment.js'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import ChooseAddress from './ChooseAddress'
import ExperimentComplete from './ExperimentComplete'
import PushNotification from 'react-native-push-notification'
import firebase from 'react-native-firebase';
import Geocoder from 'react-native-geocoding'
import Database from '../lib/Database.js'

export default class App extends Component<{}> {

    componentWillMount()
    {
        //Register to push notifications
        PushNotification.configure({
            onRegister: function(token) {
                console.log( 'TOKEN:', token );
            },
            onNotification: function(notification) {
                console.log( 'NOTIFICATION:', notification );
            },
            senderID: "YOUR GCM SENDER ID",

            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true,
        });

        BackgroundGeolocation.configure({
            desiredAccuracy: 10,
            stationaryRadius: 10,
            distanceFilter: 50,
            startForeground:false,
            debug: false,
            startOnBoot: false,
            stopOnTerminate: false,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 5000,
            fastestInterval: 1000,
            activitiesInterval: 100,
            stopOnStillActivity: false,
            url: 'http://192.168.81.15:3000/location',
        });
        console.log("App.js called");
        BackgroundGeolocation.on('location', (location) => {
            console.log("BackgroundGeolocation (Active)" + JSON.stringify(location));
            firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    const id = user.uid;
                    this.getHomeAddress(user.uid).then((home_location) => {
                        let range = .001;
                        let left_upper_point = {latitude: home_location.lat + range, longitude: home_location.lng - range};
                        let right_upper_point = {latitude: home_location.lat + range, longitude: home_location.lng + range};
                        let left_lower_point = {latitude: home_location.lat - range, longitude: home_location.lng - range};
                        let right_lower_point = {latitude: home_location.lat - range, longitude: home_location.lng + range};

                        if(location.longitude > left_upper_point.longitude &&
                        location.longitude < right_upper_point.longitude &&
                        location.latitude < left_upper_point.latitude &&
                        location.latitude > left_lower_point.latitude){
                            PushNotification.localNotification({
                                autoCancel: true, // (optional) default: true
                                largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
                                smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
                                bigText: "Remember to fill out your survey!", // (optional) default: "message" prop
                                subText: "Reminder", // (optional) default: none
                                color: "purple", // (optional) default: system default
                                vibrate: true, // (optional) default: true
                                vibration: 500, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                                tag: 'some_tag', // (optional) add tag to message
                                title: "Welcome Home", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
                                message: "Remember to fill out your survey!", // (required)
                                playSound: true, // (optional) default: true
                                soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
                            });
                        }
                    })
                }

            });
            BackgroundGeolocation.startTask(taskKey => {
                // execute long running task
                // eg. ajax post location
                // IMPORTANT: task has to be ended by endTask
                BackgroundGeolocation.endTask(taskKey);
            });
        });

        BackgroundGeolocation.on('stationary', (stationaryLocation) => {
            // handle stationary locations here
            //Actions.sendLocation(stationaryLocation);
            console.log("BackgroundGeolocation (Stationary) " + JSON.stringify(stationaryLocation));
        });

        BackgroundGeolocation.on('error', (error) => {
            console.log('[ERROR] BackgroundGeolocation error:', error);
        });

        BackgroundGeolocation.on('start', () => {
            console.log('[INFO] BackgroundGeolocation service has been started');
        });

        BackgroundGeolocation.on('stop', () => {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
        });

        BackgroundGeolocation.on('authorization', (status) => {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
            if (status !== BackgroundGeolocation.AUTHORIZED) {
                Alert.alert('Location services are disabled', 'Would you like to open location settings?', [
                    { text: 'Yes', onPress: () => BackgroundGeolocation.showLocationSettings() },
                    { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
                ]);
            }
        });

        BackgroundGeolocation.on('background', () => {
            console.log('[INFO] App is in background');
        });

        BackgroundGeolocation.on('foreground', () => {
            console.log('[INFO] App is in foreground');
        });

        BackgroundGeolocation.checkStatus(status => {
            console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
            console.log('[INFO] BackgroundGeolocation service has permissions', status.hasPermissions);
            console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

            // you don't need to check status before start (this is just the example)
            if (!status.isRunning) {
                BackgroundGeolocation.start(); //triggers start on start event
            }
        });
    }

    getHomeAddress = (user_uid) => {
        return Database.getUserAddress(user_uid).then((address) => {
          return Promise.resolve(this.findGeoLocation(address));
        });
    };



    /**
     * Find the longitude and latitude of a user given its home address
     */
    findGeoLocation = (home_address) => {
       return Geocoder.getFromLocation(home_address).then(
            json => {
                return Promise.resolve(json.results[0].geometry.location)
            },
            error => {
                console.log(error);
            }
        );
    };

    componentWillUnmount() {
        // unregister all event listeners
        BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
    }

    render() {
        return (
            <RootNavigator />
        )}
}

var navigationBarStyles = StyleSheet.create({
    navigationBar: {
        backgroundColor: '#FFFFFF',
        height: 30,
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        justifyContent: 'space-between'
    },
});

const RootNavigator =
    StackNavigator(
        {
            SignIn: {
                screen: Main,
            },
            ChooseAddress:
            {
                screen: ChooseAddress,
            },
            ExperimentComplete:
            {
                screen: ExperimentComplete,
            },
            Authenticated: {
                screen:
                    TabNavigator({
                        HomePage: {
                            screen: HomePage,
                        },
                        ExperimentBrowse: {
                            screen:
                                StackNavigator({
                                        ExperimentBrowse: {
                                            screen: ExperimentBrowse
                                        },
                                        Experiment: {
                                            screen: Experiment
                                        }
                                    },
                                    {
                                        headerMode: "none"
                                    })
                        },
                        UserProfile: {
                            screen: UserProfile
                        },
                    },
                    {
                        tabBarComponent: TabBar,
                        headerMode: 'none',
                        tabBarPosition: 'bottom',
                    })
            }
        },
        {
            headerMode:'none'
        });
//AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);

//() => (<LoginForm SignUp={true}}/>) how to pass props
