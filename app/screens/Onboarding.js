import React, { Component } from 'react';
import {Icon,Button, Text, Tile, SearchBar, List, ListItem, Card} from 'react-native-elements';
import {View} from 'react-native';
import { Utils } from '../lib/Utils'
import Onboarding from 'react-native-onboarding-swiper';


export default class Onboarding extends Component<{}> {
    constructor(props) {
        super(props);

        this.state =
            {
                leaders:[]
            }
    }

    componentDidMount(){
        this.getLeaders();
    }



    render() {
        return (
            <View>
                <Onboarding
                    pages={[
                        {
                            backgroundColor: '#fff',
                            image: <Image source={require('./images/circle.png')} />,
                            title: 'Onboarding',
                            subtitle: 'Done with React Native Onboarding Swiper',
                        },
                        {
                            backgroundColor: '#fe6e58',
                            image: <Image source={require('./images/square.png')} />,
                            title: 'The Title',
                            subtitle: 'This is the subtitle that sumplements the title.',
                        },
                        {
                            backgroundColor: '#999',
                            image: <Image source={require('./images/triangle.png')} />,
                            title: 'Triangle',
                            subtitle: "Beautiful, isn't it?",
                        },
                    ]}
                />
            </View>
        )
    }
}