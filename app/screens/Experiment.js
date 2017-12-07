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

        // Determine if the user is already subscribed to this experiment - if so, don't let them subscribe again
        this.getMyExperimentData();
        this.setState({
            experiment: this.props.navigation.state.params.experiment.val,
            active_user_count: this.props.navigation.state.params.experiment.val.active_user_count,
        });

    }

    //Get the current user's experiment data under experiments directory
    getMyExperimentData() {
        Database.getMyExperimentData().then((data) => {
            this.setState({
                userExperimentID: data.experiment_id
            }, this.isUserSubscribed);
        });
    }


    isUserSubscribed() {
        var experimentID = this.props.navigation.state.params.experiment.id;
        var userExperimentID = this.state.userExperimentID;

        if(userExperimentID && experimentID){
            console.log("userExperimentID: "+ userExperimentID + " experimentID: " +experimentID)
            if(userExperimentID == experimentID){
                console.log("ALREADY SUBSCRIBED!");
                this.setState({isUserAlreadySubscribed: true});
            }
        }
    }

    subscribeToExperiment() {
        //console.log("The user is subscribing to a an experiment: "+this.state.experimentID);
        Database.setUserExperiment(this.props.navigation.state.params.experiment.id)
        this.setState({
            isUserAlreadySubscribed: true,
            active_user_count: this.state.active_user_count+1
        });
    }

    render() {


        return (
            <View style={{flex: 1}}>
                <ScrollView>

                    <Tile
                        imageSrc={ExperimentImages.getImage(this.state.experiment.name)}
                        title= {this.state.experiment.name}
                        contentContainerStyle={{height: 90}}
                    >
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>Active Users: {this.state.active_user_count}</Text>
                            <Text>Satisfaction: {this.state.experiment.total_satisfaction} %</Text>
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
                            onPress={(event) => this.subscribeToExperiment(event)}/>}



                </ScrollView>
                <View>
                    <Navbar navigation = {this.props.navigation}/>
                </View>
            </View>

        )}
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
