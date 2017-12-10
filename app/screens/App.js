
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

export default class App extends Component<{}> {

    componentWillMount()
    {
        //set up background location listening. This will only be called once when the app opens and be unmounted
        //once the app is QUIT (not just put into the background)

        BackgroundGeolocation.configure({
            desiredAccuracy: 10,
            stationaryRadius: 10,
            distanceFilter: 50,
            notificationTitle: 'Background tracking',
            notificationText: 'enabled',
            debug: true,
            startOnBoot: false,
            stopOnTerminate: false,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 5000,
            fastestInterval: 1000,
            activitiesInterval: 100,
            stopOnStillActivity: false,
            url: 'http://192.168.81.15:3000/location',
            /*httpHeaders: {
                'X-FOO': 'bar'
            }*/
        });

        BackgroundGeolocation.on('location', (location) => {
            // handle your locations here
            // to perform long running operation on iOS
            // you need to create background task
            console.log("BackgroundGeolocation (Active)" + JSON.stringify(location));

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
