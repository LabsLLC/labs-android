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
        Geocoder.setApiKey(Secrets.GoogleApiSecret);
        this.state = {
            searchText:'',
            latitude: null,
            longitude: null,
            error: null,
            user_uid: null,
            home_address: null,
        };
    }

    componentDidMount(){

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
        //Temporary list...
        const list = [
            {
                name: 'Wake Up Early',
                subtitle: 'Start this two week experiment',
                icon: 'av-timer'
            },
            {
                name: 'No Phone Before Bed',
                subtitle: 'Put the god damn phone away',
                icon: 'av-timer'
            },
            {
                name: 'Exersize Daily',
                subtitle: 'Hit the gym yo',
                icon: 'av-timer'
            },
            {
                name: 'Eat Healthy',
                subtitle: 'Veggies and Keenwah man',
                icon: 'av-timer'
            }
        ];

        return (
            <View style={{flex: 1}}>

            <ScrollView>
                <View>
                    <Text h4> Experiments </Text>
                    <Text> See how you are doing with your experiments </Text>


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

                        <List containerStyle={{marginBottom: 20}}>
                            {
                                list.map((item, i) => (
                                    <ReactionModal item={item} index={i}/>
                                ))
                            }
                        </List>

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
