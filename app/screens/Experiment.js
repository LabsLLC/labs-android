import React, { Component } from 'react';
import {Button, Text, Tile, SearchBar, List, ListItem} from 'react-native-elements';
import {ScrollView, Modal, StyleSheet} from 'react-native';
import {View} from 'react-native';
import Navbar from '../components/NavBar/Navbar.js'
//import WakeUpImage from '../images/experiments/icon_wakeup.png';
//import ExerciseImage from '../images/experiments/icon_wakeup.png';
import ExperimentImages from '../config/utils'

export default class Experiment extends Component<{}> {

    constructor(props) {
        super(props);
        //function bindings
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            experiment: null,
        };
    }

    handleChange(event) {
        this.setState({ searchText: event});
    }

    componentWillMount() {
        this.setState({experiment: this.props.navigation.state.params.experiment.val });
        console.log("3HERE!!!!: "+ this.props.navigation.state.params.experiment.val);




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
                            <Text>Active Users: {this.state.experiment.active_user_count}</Text>
                            <Text>Satisfaction: {this.state.experiment.total_satisfaction} %</Text>
                        </View>
                    </Tile>

                    <View style={{flex: 1}}>
                        <Text>{this.state.experiment.description}</Text>
                    </View>



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

