import React, { Component } from 'react';
import {Button, Text, Tile, SearchBar, List, ListItem} from 'react-native-elements';
import {ScrollView, Modal, StyleSheet} from 'react-native';
import {View} from 'react-native';
import Navbar from '../components/NavBar/Navbar.js'
//import WakeUpImage from '../images/experiments/icon_wakeup.png';
//import ExerciseImage from '../images/experiments/icon_wakeup.png';
import ExperimentImages from '../config/utils'
import Database from '../lib/Database.js';

export default class Experiment extends Component<{}> {

    constructor(props) {
        super(props);
        //function bindings
        this.handleChange = this.handleChange.bind(this);
        this.getMyExperimentData = this.getMyExperimentData.bind(this);
        this.getThisExperimentInfo = this.getThisExperimentInfo.bind(this);
        this.isUserSubscribed = this.isUserSubscribed.bind(this);
        this.subscribeToExperiment = this.subscribeToExperiment.bind(this);


        this.state = {
            experiment: null,
            active_user_count: null,
            experimentID: null,
            userExperimentID: null,
            isUserAlreadySubscribed: false
        };
    }

    handleChange(event) {
        this.setState({ searchText: event});
    }

    componentWillMount() {

        //Get this page's information
        this.getThisExperimentInfo().then(() => {
            this.getMyExperimentData().then(() =>{
                this.isUserSubscribed();
            });
        });
    }

    //THE PAGES INFO
    getThisExperimentInfo() {
        //console.log("this.props.navigation.state.params.experimentID: "+this.props.navigation.state.params.experimentID);
        return Database.getMyExperimentInfo(this.props.navigation.state.params.experimentID).then((experimentData) => {
            this.setState({
                experiment: experimentData
            });
        });
    }

    //THE USERS INFO
    getMyExperimentData() {
        return Database.getMyExperimentData().then((data) => {
            this.setState({
                userExperimentID: data.experiment_id
            });
        });
    }


    isUserSubscribed() {
        var experimentID = this.props.navigation.state.params.experimentID;
        var userExperimentID = this.state.userExperimentID;

        if(userExperimentID && experimentID){
            //console.log("userExperimentID: "+ userExperimentID + " experimentID: " +experimentID)
            if(userExperimentID == experimentID){
                console.log("ALREADY SUBSCRIBED!");
                this.setState({isUserAlreadySubscribed: true});
            }
        }
    }

    subscribeToExperiment() {
        //console.log("The user is subscribing to a an experiment: "+this.state.experimentID);
        Database.unsubscribeUser(this.state.userExperimentID).then(() =>
        {
            Database.archiveUserData(this.state.userExperimentID).then(() => {
                Database.setUserExperiment(this.props.navigation.state.params.experimentID).then(() => {
                    this.setState({
                        isUserAlreadySubscribed: true,
                    }, this.getThisExperimentInfo);
                });
            });

        })


        //.then(() => {
            //then archive
            //Database.archiveUserData(this.state.userExperimentID).then(() => {
                //then clear reaction data

            //});
        //});

    }


    render() {


        if (this.state.experiment) {
            return (
                <View style={{flex: 1}}>
                    <ScrollView>

                        <Tile
                            imageSrc={ExperimentImages.getImage(this.state.experiment.name)}
                            title={this.state.experiment.name}
                            contentContainerStyle={{height: 90}}
                        >
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text>Active Users: {this.state.experiment.active_user_count}</Text>

                                {this.state.experiment.total_satisfaction != undefined || this.state.experiment.total_satisfaction != null?
                                    <Text>Satisfaction: {parseFloat(Math.round(this.state.experiment.total_satisfaction * 100)).toFixed(2)  } %</Text>
                                    : <Text>No data yet!</Text>
                                }
                            </View>
                        </Tile>

                        <View style={{flex: 1, margin: 10}}>
                            <Text>{this.state.experiment.description}</Text>
                        </View>

                        {this.state.isUserAlreadySubscribed == true ?
                            <Button
                                raised
                                icon={{name: 'cached'}}
                                title='Already subscribed'
                                disabled/>
                            : <Button
                                raised
                                icon={{name: 'cached'}}
                                title='Subscribe to experiment'
                                onPress={() => this.subscribeToExperiment()}/>}


                    </ScrollView>
                    <View>
                        <Navbar navigation={this.props.navigation}/>
                    </View>
                </View>

            )
        } else {
            return (
                <View>
                    <Text>
                        Loading...
                    </Text>
                </View>
            )
        }
    }
}

module.exports = Experiment;





const styles = StyleSheet.create({
    dividerTextStyle: {
        textAlign: 'left',
        fontSize: 20,
    }
});


/*
{this.state.isUserAlreadySubscribed == true ?
                        <Button
                            raised
                            icon={{name: 'cached'}}
                            title='Already subscribed'
                            disabled/>
                        : <Button
                            raised
                            icon={{name: 'cached'}}
                            title='Subscribe to experiment'
                            onPress={(event) => this.subscribeToExperiment(event)}/>}
 */
