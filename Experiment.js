import React, { Component } from 'react';
import {Button, Text, Tile, SearchBar, List, ListItem} from 'react-native-elements';
import {ScrollView, Modal, StyleSheet} from 'react-native';
import {View} from 'react-native';
import Navbar from './Navbar.js'

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

