import React, { Component } from 'react';
import {Icon,Button, Text, Tile, SearchBar, List, ListItem, Card} from 'react-native-elements';
import {View, Image, Alert, StatusBar} from 'react-native';

import { Utils } from '../lib/Utils'
import Onboarding from 'react-native-onboarding-swiper';



class OnboardingPage extends Component<{}> {

    constructor(props) {
        super(props);

    }

    render() {
        return (

                <Onboarding
                    onDone={() =>  this.props.navigation.navigate("SignIn")}
                    pages={[
                        {
                            backgroundColor: '#fff',
                            image: <Image source={require('../images/onboarding/exercise.png')} />,
                            title: 'Onboarding',
                            subtitle: 'Done with React Native Onboarding Swiper',
                        },
                        {
                            backgroundColor: '#fff',
                            image: <Image source={require('../images/onboarding/wakeupearly.png')} />,
                            title: 'Onboarding',
                            subtitle: 'Done with React Native Onboarding Swiper',
                        },
                    ]}

                />


        )
    }
}

export default OnboardingPage;
