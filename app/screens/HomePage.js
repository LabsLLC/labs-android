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
            progress:0,
            daysLeft:" "
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

      //  setTimeout(()=> {this.setState({progress:50})}, 1000);
    }

    handleChange(event) {
        this.setState({ searchText: event});
    }

    calculateProgress()
    {
        setTimeout(()=> {
            this.setState({
                daysLeft: 14-Object.keys(this.state.my_experiment_data.reactions).length,
                progress: (Object.keys(this.state.my_experiment_data.reactions).length/14) * 100})}, 500);

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
        let daysCompleted = this.getNumberOfDaysCompleted();

        if(daysCompleted >= 14) {
            Database.unsubscribeUser(this.state.my_experiment_data.experiment_id).then(() => {
                Database.archiveUserData(this.state.my_experiment_data.experiment_id).then(() => {
                    Database.clearUserExperiment().then(() => {
                        this.props.navigation.navigate("ExperimentComplete", {experiment: this.state.experiment_info});
                    });
                });
            });
        }
    }

    /**
     * Returns the number of days completed by the user
     *
     * Returns: int, days completed
     */
    getNumberOfDaysCompleted() {
        data = [];

        if(this.state.my_experiment_data && this.state.my_experiment_data.reactions) {
            Object.keys(this.state.my_experiment_data.reactions).forEach((key, index) => {

                var info = (this.state.my_experiment_data.reactions[key]);
                var val = {x: key, y: info.reaction};
                data.push(val);
            });
        }

        if(data.length > 0) {

            let startDate = new Date(data[0].x);
            let lastDate = new Date(data[data.length - 1].x);

            let timeDiff = Math.abs(lastDate.getTime() - startDate.getTime());
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            return diffDays;
        }

        return 0;
    }

    getMyExperimentData() {

        //Get the current user's experiment data under experiments directory
        //Side effect: updates start date from data retrieved

        Database.getMyExperimentData().then((data) => {
            this.setState({
                my_experiment_data: data
            }, this.getExperimentInfo);

            if (data && "reactions" in data && Object.keys(data.reactions).length > 0) {
                console.log("has reactions");
                let firstKey = Object.keys(data.reactions)[0];
                let startDate = new Date(firstKey);

                this.state.my_experiment_data.start_date = startDate.toLocaleString();
                this.calculateProgress();
            }
            else {
                this.setState({
                    daysLeft: 14,
                    progress: 0
                });
            }
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
                    <Card>
                        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                            <Text style = {styles.dividerTextStyle}>Your Progress</Text>
                            <View style= {{flex:1, alignItems:'center', marginTop:20, alignSelf:"center"}}>
                                <AnimatedCircularProgress
                                    rotation={0}
                                    linecap="round"
                                    size={228}
                                    width={28}
                                    fill={this.state.progress}
                                    tintColor="#5764fe"
                                    onAnimationComplete={() => console.log('onAnimationComplete')}
                                    backgroundColor="#FFFFFF">
                                </AnimatedCircularProgress>
                                <View style={{top: -20, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', position: 'absolute'}}>
                                    <Text style={{fontSize:48}}>{this.state.daysLeft}</Text>
                                    <Text style={{fontSize:20}}>Days Left</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style = {styles.dividerTextStyle}>Daily Checkup</Text>
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

                    <View style={{marginBottom: 100}}>
                        <Card title="Goal Streak"
                              titleStyle = {styles.dividerTextStyle}>
                        </Card>
                    </View>

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

