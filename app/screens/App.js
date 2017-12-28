
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
import {AsyncStorage} from 'react-native';
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
import Secrets from '../config/secrets.js'
import StatsScreen from "./StatsScreen";
import Onboarding from "./Onboarding";
const LastHomeReminderKey = "LAST_NOTIFIED_KEY";
var processingGeoEvent = false;

export default class App extends Component<{}> {

    componentWillMount()
    {
     //   console.disableYellowBox = true; //hide warnings

        Geocoder.setApiKey(Secrets.GoogleApiSecret);
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

        BackgroundGeolocation.on('location', (location) => {
            console.log("BackgroundGeolocation (Active)" + JSON.stringify(location));

            //if theres an authorized user and we're not currently processing any geo events
            if(!processingGeoEvent && firebase.auth().currentUser)
            {
                processingGeoEvent = true; //don't process any geo updates until we're done here

                let user = firebase.auth().currentUser;
                const id = user.uid;

                this.getHomeAddress(user.uid).then((home_location) => {
                    console.log("home is where the heart is!!" + JSON.stringify(home_location));
                    console.log("but unfortunately I am here" + JSON.stringify(location));

                    AsyncStorage.getItem(LastHomeReminderKey).then((value) => {
                        notifiedToday = false;
                        console.log("Retrieved last reminded time. ");

                        if (value) //todo reset this when address is changed
                        {
                            console.log("Received: " + value);

                            let lastNotifiedDate = new Date();
                            lastNotifiedDate.setTime(value);

                            var timeDiff = Math.abs(lastNotifiedDate - Date.now());
                            var diffHours = Math.ceil(timeDiff / (1000 * 3600));

                            if (diffHours < 20) {
                                console.log("Home, but user was already notified.");

                                console.log("Last notified at home " + lastNotifiedDate.toLocaleDateString() + ", " +
                                    diffHours + " hours ago.");
                                notifiedToday = true;
                            }
                        }

                        if (!notifiedToday && this.userIsHome(location, home_location)) {
                            App.sendHomeReminder();
                        }

                        processingGeoEvent = false;
                    });
                });
            }
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

    userIsHome(currentLocation, homeLocation) {
        let range = .001;

        let left_upper_point = {latitude: homeLocation.lat + range, longitude: homeLocation.lng - range};
        let right_upper_point = {latitude: homeLocation.lat + range, longitude: homeLocation.lng + range};
        let left_lower_point = {latitude: homeLocation.lat - range, longitude: homeLocation.lng - range};

        return (currentLocation.longitude > left_upper_point.longitude &&
            currentLocation.longitude < right_upper_point.longitude &&
            currentLocation.latitude < left_upper_point.latitude &&
            currentLocation.latitude > left_lower_point.latitude);
    }

    static sendHomeReminder()
    {
        console.log("sending...");
        App.sendNotification("Welcome Home",  "Don't forget your daily check in!");
        AsyncStorage.setItem(LastHomeReminderKey, Date.now().toString());
        console.log("Set item");
        //todo update last reminded in database
    }

    static sendNotification(title, message)
    {
        PushNotification.localNotification({
            autoCancel: true, // (optional) default: true
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            bigText: message, // (optional) default: "message" prop
            subText: "Reminder", // (optional) default: none
            color: "purple", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 500, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'some_tag', // (optional) add tag to message
            title: title, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
            message: message, // (required)
            playSound: true, // (optional) default: true
            soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        });
    }

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
            Onboarding: {
                screen: Onboarding,
            },
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
                        Stats:
                        {
                            screen: StatsScreen
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
