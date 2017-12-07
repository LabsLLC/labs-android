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

export default class HomePage extends Component<{}> {

    constructor(props) {
        super(props);
        //function bindings
        this.handleChange = this.handleChange.bind(this);
        this.getExperimentInfo = this.getExperimentInfo.bind(this);

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

        //Get the current user's experiment data -> then get the experiments associated information to populate the screen
        Database.getMyExperimentData().then((data) => {
            this.setState({
                my_experiment_data: data
            }, this.getExperimentInfo);
        });


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

        console.log("DATA1: "+JSON.stringify(this.state.my_experiment_data));

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

    render() {

        return (
            <View style={{flex: 1}}>

            <ScrollView>
                <View>
                    <Text h4> My {this.state.experiment_info ? <Text>{this.state.experiment_info.name}</Text> : null} </Text>
                    <Text> See how you are doing with your experiment </Text>


                    <Card title="Day 2"
                          titleStyle = {styles.dividerTextStyle}>

                    </Card>

                    <Card >
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style = {styles.dividerTextStyle}> Daily Checkup </Text>

                            <Icon
                                name='assignment'
                                color='#00aced' />
                        </View>
                        <Text>You still need to record progress for:  </Text>

                        {this.state.experiment_info ?  <ReactionModal item={this.state.experiment_info} index={1}/> : null}


                    </Card>

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

