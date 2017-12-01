import React, { Component } from 'react';
import {Button, Text, Tile, SearchBar, List, ListItem} from 'react-native-elements';
import {ScrollView, Modal, StyleSheet} from 'react-native';
import {View} from 'react-native';
import Navbar from './Navbar.js'


export default class ExperimentBrowse extends Component<{}> {

    constructor(props) {
        super(props);
        //function bindings
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            searchText:'',
        };
    }

    handleChange(event) {
        this.setState({ searchText: event});
    }
    handleTileClick(event) {
        console.log("Clicked Image "+event.toString()) //Not sure what is within this event object - cyclical structure
        //this.setState({ searchText: event});
    }
    handleClickExperiment(event){
        console.log("Clicked List item "+event.toString())
    }


    render() {
        let searchText = this.state.searchText;

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
        ]

        return (
            <ScrollView>
            <View>
                <Text h4> Experiments </Text>
                <SearchBar
                    lightTheme
                    round
                    onChangeText={(event) => this.handleChange(event)}
                    onClearText={(event) => this.handleChange(event)}
                    placeholder='Type Here...' />

                <Tile
                    icon={{name: 'favorite',  color: '#ffffff'  }}
                    imageSrc={require('./images/wakeupearly.png')}
                    title="Wake Up Early"
                    featured
                    titleStyle= {styles.dividerTextStyle}
                    caption="Get in the habit of being productive"
                    onPress={(event) => this.handleTileClick(event)}
                />


                <List containerStyle={{marginBottom: 20}}>
                    {
                        list.map((l, i) => (
                            <ListItem
                                key={i}
                                leftIcon={{name: l.icon}}
                                title={l.name}
                                subtitle={l.subtitle}
                                onPress={(event) => this.handleClickExperiment(event)}
                            />
                        ))
                    }
                </List>

                <Button
                    raised
                    icon={{name: 'cached'}}
                    title='See more' />

            </View>
                <Navbar navigation = {this.props.navigation}/>
            </ScrollView>

        )}
}

module.exports = ExperimentBrowse;


const styles = StyleSheet.create({
    dividerTextStyle: {
        textAlign: 'left',
        fontSize: 20,
    }
});