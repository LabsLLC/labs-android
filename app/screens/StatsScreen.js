import React, { Component } from 'react';
import {Icon,Button, Text, Tile, SearchBar, List, ListItem, Card} from 'react-native-elements';
import {ScrollView, Modal, StyleSheet} from 'react-native';
import {View} from 'react-native';
import ReactionModal from '../components/ReactionModal/ReactionModal.js'
import firebase from 'react-native-firebase';
import Database from '../lib/Database.js'
import { VictoryArea,VictoryChart, VictoryTheme } from "victory-native";
import { Svg } from 'react-native-svg'
import { Utils } from '../lib/Utils'
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const experiment_length = 14;

export default class StatsScreen extends Component<{}> {
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

    getLeaders()
    {
        Database.getAllUsers().then((data) => {
            console.log("Users: " + JSON.stringify(data));

            let leaders = [];

            Object.keys(data).forEach((key, index) => {
                let user = key;
                data[user].completedExperiments = data[user].archive_data.length;

                console.log(data[user].name + " " + data[user].completedExperiments);

                leaders.push({name: data[user].name, completed: data[user].completedExperiments});
            });

            //Sort the user's data by ascending dates
            leaders = leaders.sort(function(a, b) {
                return ((a.completed > b.completed) ? -1 : ((a.completed < b.completed) ? 1 : 0));
            });

            this.setState({leaders: leaders});

            //Convert keys back to indexes for display [dates -> index]
            //*data.forEach((value, index) => {
            //    data[index].x = index;
            //})//
        });
    }

    render() {
        return (
            <View>
                <Text h4 style={{marginTop: 20, marginLeft: 20, fontSize:24}}>Leaders</Text>
                <Text style={{marginTop: 4, marginLeft: 20, fontSize:16}}>Ranked By Experiments Completed</Text>
                <List containerStyle={{marginBottom: 20}}>
                    {
                        this.state.leaders.map((user) => {
                            const name = user.name;
                            const completed = user.completed;

                            return (
                                <ListItem
                                    key={name}
                                    title={name}
                                    subtitle={"Completed Experiments: " + completed}
                                />
                            )}
                        )
                    }
                </List>
            </View>
        )
    }
}