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

export default class HomePage extends Component<{}> {

    constructor(props) {
        super(props);
        //function bindings
        this.handleChange = this.handleChange.bind(this);
        this.getExperimentInfo = this.getExperimentInfo.bind(this);
        this.getMyExperimentData = this.getMyExperimentData.bind(this);
        this.hasUserCompletedExperiment = this.hasUserCompletedExperiment.bind(this);


        this.state = {
            searchText:'',
            error: null,
            user_uid: null,
            home_address: null,
            my_experiment_data: null,
            experiment_info: null,
        };
    }



    componentDidMount(){
       this.getMyExperimentData();


        //Retrieve current users id
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                var id = user.uid;
                this.setState({
                    user_uid: id
                });

                //update the page
                var ref = firebase.database().ref("/user/"+id);
                ref.on('value', (snapshot) => {
                    // Do whatever
                    this.getMyExperimentData();
                });

            }

        });
    }

    handleChange(event) {
        this.setState({ searchText: event});
    }

    /** (Andrew added)
     * Retrieve the experiment information of a user given experiment
     */
    getExperimentInfo() {
        Database.getMyExperimentInfo(this.state.my_experiment_data.experiment_id).then((data) => {
            this.setState({
                experiment_info: data
            }, this.hasUserCompletedExperiment);
        }).catch((error) => {
            console.log("Error because: "+error);
        });
    }


    /**
     * Check if user has completed experiment, if yes, redirect.
     */
    hasUserCompletedExperiment() {
        data = [];
        if(this.state.my_experiment_data && this.state.my_experiment_data.reactions) {
            Object.keys(this.state.my_experiment_data.reactions).forEach((key, index) => {

                var info = (this.state.my_experiment_data.reactions[key]);
                var val = {x: key, y: info.reaction};
                data.push(val);
            });
        }

        if(data.length > 0)
        {
            var startDate = new Date(data[0].x);
            var lastDate = new Date(data[data.length-1].x);

            var timeDiff = Math.abs(lastDate.getTime() - startDate.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            this.state.my_experiment_data.start_date = startDate;

            if(diffDays >= 14) {
                Database.unsubscribeUser(this.state.my_experiment_data.experiment_id).then(() => {
                    Database.archiveUserData(this.state.my_experiment_data.experiment_id).then(() => {
                        Database.clearUserExperiment().then(() => {
                            this.props.navigation.navigate("ExperimentComplete", {experiment: this.state.experiment_info});
                        });
                    });
                });
            }
        }
    }

    getMyExperimentData() {
        //Get the current user's experiment data under experiments directory
        Database.getMyExperimentData().then((data) => {
            this.setState({
                my_experiment_data: data
            }, this.getExperimentInfo);
        });
    }

    render() {

        let data = [];

        if(this.state.my_experiment_data && this.state.my_experiment_data.reactions){
            Object.keys(this.state.my_experiment_data.reactions).forEach((key, index) => {

                var info = (this.state.my_experiment_data.reactions[key]);
                var val = {x: key, y: info.reaction};
                data.push(val);
            });
            //Sort the user's data by ascending dates
            data.sort(function(a, b) {
                return a.x.localeCompare(b.x)
            });


            //Convert keys back to indexes for display [dates -> index]
            data.forEach((value, index) => {
                data[index].x = index;
            })
        }



        return (
            <View style={{flex: 1,  marginTop: 10}}>

            <ScrollView>
                <View>
                    <View style={{marginLeft:12, marginTop: 4}}>
                        <Text h4> {this.state.experiment_info ? <Text>{this.state.experiment_info.name}</Text> : null} </Text>
                        <Text> See how you are doing with your experiment </Text>
                    </View>
                    <Card >
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style = {styles.dividerTextStyle}> Daily Checkup </Text>

                            <Icon
                                name='assignment'
                                color='#00aced' />
                        </View>
                        <Text>You still need to record progress for:  </Text>
                        {this.state.experiment_info ?  <ReactionModal  experimentInfo={this.state.experiment_info} experimentData={this.state.my_experiment_data} callback= {this.getMyExperimentData} index={1}/> : null}
                    </Card>

                    {data.length > 1 && this.state.my_experiment_data.start_date ?
                    <Card title={`Started: ${this.state.my_experiment_data.start_date}`}
                          titleStyle = {styles.dividerTextStyle}>

                        <View >
                            <Svg width={400} height={350}>
                                <VictoryChart
                                    standalone={false}
                                    theme={VictoryTheme.material}>
                                     <VictoryArea
                                        style={{ data: { fill: "#c43a31" } }}
                                        data={data}
                                    />
                                </VictoryChart>
                            </Svg>
                        </View>
                    </Card>
                        : null}

                    <Card title="Goal Streak"
                          titleStyle = {styles.dividerTextStyle}>
                    </Card>

                </View>
            </ScrollView>
            </View>
        )}
}

module.exports = HomePage;

const styles = StyleSheet.create({
    dividerTextStyle: {
        textAlign: 'left',
        fontSize: 20,
    }
});

