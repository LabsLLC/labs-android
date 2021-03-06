import React, { Component } from 'react';
import {Button, Text, Tile, SearchBar, List, ListItem} from 'react-native-elements';
import {ScrollView, Modal, StyleSheet} from 'react-native';
import {View} from 'react-native';
import Database from '../lib/Database.js';
import firebase from 'react-native-firebase';


export default class ExperimentBrowse extends Component<{}> {

    constructor(props) {
        super(props);
        //function bindings
        this.handleChange = this.handleChange.bind(this);
        this.getExperiments = this.getExperiments.bind(this);

        this.state = {
            experimentData: null,
            featuredExperiment: null,
            featuredExperimentImage: '',
        };
    }

    handleChange(event) {
        this.setState({ searchText: event});
    }

    handleTileClick(event) {
        console.log("Clicked Image " + event.toString()) //Not sure what is within this event object - cyclical structure
        //this.setState({ searchText: event});
    }

    componentWillMount() {

       this.getExperiments();

        //Retrieve current users id
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {

                //update the page
                var ref = firebase.database().ref("/experiment/");
                ref.on('value', (snapshot) => {
                    // Do whatever
                    this.getExperiments();
                });

            }

        });
    }

    getExperiments(){
        //Query firebase to get the experiments
        Database.getExperiments()
            .then((data) => {
                this.setState({experimentData: data});

                this.setState({featuredExperiment: data[0]});
                this.setState({featuredExperimentImage: data[0].image})

                console.log("Image string: "+this.state.featuredExperimentImage);
                //Object.values(data);


            }).catch((error) => {
            console.log(error)
        });
    }


    render() {
        let experiments = this.state.experimentData;
        return (
            <View style={{flex: 1,  marginTop: 10}}>
            <ScrollView>
                <View>
                    <Text h4> Experiments </Text>
                    <SearchBar
                        lightTheme
                        round
                        onChangeText={(event) => this.handleChange(event)}
                        onClearText={(event) => this.handleChange(event)}
                        placeholder='Type Here...' />
                    {
                        this.state.featuredExperiment &&
                        (
                            <Tile
                                icon={{name: 'favorite',  color: '#ffffff'  }}
                                imageSrc={require('../images/wakeupearly.png')}
                                title={this.state.featuredExperiment.val.name}
                                featured
                                titleStyle= {styles.dividerTextStyle}
                                caption={this.state.featuredExperiment.val.description}
                                onPress={(event) =>  this.props.navigation.navigate('Experiment', {experimentID: this.state.featuredExperiment.id})}
                            />
                        )
                    }

                    <List containerStyle={{marginBottom: 20}}>
                        {
                            this.state.experimentData &&
                            this.state.experimentData.map((l) => {
                                const satisfaction = l.val.total_satisfaction != null && l.val.total_satisfaction != undefined ?
                                    "Satisfaction: " + parseFloat(Math.round(l.val.total_satisfaction * 100)).toFixed(1) + "%"  : 'No satisfaction data';
                                return (
                                <ListItem
                                    key={l.id}
                                    leftIcon={{name: l.val.icon}}
                                    title={l.val.name}
                                    subtitle={l.val.description}
                                    subtitleNumberOfLine={2}
                                    rightTitle={satisfaction}
                                    onPress={(event) =>  this.props.navigation.navigate('Experiment', {experimentID: l.id})}
                                />
                            )}
                            )

                        }
                    </List>

                    <View style={{paddingBottom: 100}}>
                    <Button
                        raised
                        icon={{name: 'cached'}}
                        title='See more' />
                    </View>
                </View>

            </ScrollView>
            </View>

        )}
}

module.exports = ExperimentBrowse;

const styles = StyleSheet.create({
    dividerTextStyle: {
        textAlign: 'left',
        fontSize: 20,
    }
});
