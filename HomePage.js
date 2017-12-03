import React, { Component } from 'react';
import {Icon,Button, Text, Tile, SearchBar, List, ListItem, Card} from 'react-native-elements';
import {ScrollView, Modal, StyleSheet} from 'react-native';
import {View} from 'react-native';
import ReactionModal from './ReactionModal.js'

export default class HomePage extends Component<{}> {

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
    handleClickExperiment(event){
        console.log("Clicked List item "+event.toString())
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
        ]


        return (
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
            </ScrollView>
        )}
}

module.exports = HomePage

const styles = StyleSheet.create({
    dividerTextStyle: {
        textAlign: 'left',
        fontSize: 20,
    }
});