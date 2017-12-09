import React, { Component } from 'react';
import {Icon,Button, Text, Tile, SearchBar, List, ListItem, Card} from 'react-native-elements';
import {ScrollView, Modal, StyleSheet} from 'react-native';
import {View} from 'react-native';
import ReactionModal from '../components/ReactionModal/ReactionModal.js'
import Navbar from '../components/NavBar/Navbar.js'
import Geocoder from 'react-native-geocoding'
import Secrets from '../config/secrets.js'
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

        Geocoder.setApiKey(Secrets.GoogleApiSecret);
        this.state = {
            searchText:'',
            latitude: null,
            longitude: null,
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
                }, this.getHomeAddress);
            }
        });

        //Users current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
    }

    handleChange(event) {
        this.setState({ searchText: event});
    }

    handleClickExperiment(event){
        console.log("Clicked List item "+event.toString())
    }

    /**
     * Retrieve the home address of a user given its user id
     */
    getHomeAddress() {
        Database.getUserAddress(this.state.user_uid).then((address) => {
            this.setState({
                home_address: address
            }, this.findGeoLocation)
        });
    }

    /** (Andrew added)
     * Retrieve the experiment information of a user given experiment
     */
    getExperimentInfo() {
        Database.getMyExperimentInfo(this.state.my_experiment_data.experiment_id).then((data) => {
            this.setState({
                experiment_info: data
            });
        }).catch((error) => {
            console.log("Error because: "+error);
        });
    }


    /**
     * Find the longitude and latitude of a user given its home address
     */
    findGeoLocation() {
        Geocoder.getFromLocation(this.state.home_address).then(
            json => {
                var location = json.results[0].geometry.location;
                console.log(location.lat + ", " + location.lng);
            },
            error => {
                console.log(error);
            }
        );
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
                    <Text h4> My {this.state.experiment_info ? <Text>{this.state.experiment_info.name}</Text> : null} </Text>
                    <Text> See how you are doing with your experiment </Text>

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



                    {data.length > 1 ?
                    <Card title={`Started: ${this.state.my_experiment_data.start_date.replace(/_/g, '/')}`}
                          titleStyle = {styles.dividerTextStyle}>

                        <View style={styles.container}>
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

                <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Latitude: {this.state.latitude}</Text>
                    <Text>Longitude: {this.state.longitude}</Text>
                    {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
                </View>

            </ScrollView>
                <View>
                    <Navbar navigation = {this.props.navigation}/>
                </View>
            </View>
        )}
}

module.exports = HomePage

const styles = StyleSheet.create({
    dividerTextStyle: {
        textAlign: 'left',
        fontSize: 20,
    }
});

