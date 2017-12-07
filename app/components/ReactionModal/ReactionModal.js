import React, { Component } from 'react';
import {StyleSheet, Modal, Text, TouchableHighlight, View } from 'react-native';
import {Icon, Button,  Tile, SearchBar, List, ListItem} from 'react-native-elements';
import styles from './styles'
import Database from '../../lib/Database.js'



class ReactionModal extends Component {
    constructor(props) {
        super(props);
        this.postReaction = this.postReaction.bind(this);
        //function bindings
        //this.handleChange = this.handleChange.bind(this);

        this.state = {
            modalVisible: false,
        };
    }

    postReaction(experiment_id, complete, reaction){
        Database.addDailyReaction(experiment_id, complete, reaction);
        this.setModalVisible(!this.state.modalVisible);
        this.props.callback()
    }

    /*
    state = {
        modalVisible: false,
    }*/

    //Here, we want to pass another variable depending on what emoji we clicked - Then send the data to the database!
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    render() {
        //console.log("this.state.experiment_info.id: " + this.props.experiment_info);


        if ('experimentInfo' in this.props) {

            var experiment_id = this.props.experimentData.experiment_id;

            return (
                <View style={{marginTop: 22}}>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            alert("Modal has been closed.")
                        }}
                    >
                        <View style={{marginTop: 22}}>
                            <View>
                                <Text  style = {styles.dividerTextStyle}>How did you feel today?</Text>

                                <View style = {styles.emojiDivider} >
                                    <View style={styles.emojiToken} >
                                        <TouchableHighlight onPress={() => {
                                            this.postReaction(experiment_id, 1, 0);
                                        }}>
                                            <View>
                                                <Icon
                                                    size={100}
                                                    name='sentiment-very-dissatisfied'
                                                    color="#be0002"/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.emojiToken} >
                                        <TouchableHighlight onPress={() => {
                                            this.postReaction(experiment_id, 1, .5);
                                        }}>
                                            <View>
                                                <Icon
                                                    size={100}
                                                    name='sentiment-neutral'
                                                    color='#00aced' />
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.emojiToken} >
                                        <TouchableHighlight onPress={() => {
                                            this.postReaction(experiment_id, 1, 1);
                                        }}>
                                            <View>
                                                <Icon
                                                    size={100}
                                                    name='sentiment-very-satisfied'
                                                    color="#1dab00"/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>

                            </View>
                        </View>
                    </Modal>

                    <TouchableHighlight onPress={() => {
                        this.setModalVisible(true)
                    }}>

                    <View>
                        <ListItem
                            leftIcon={{name: this.props.experimentInfo.icon}}
                            key={this.props.experimentInfo.index}
                            title={this.props.experimentInfo.name}
                            onPress={() => this.setModalVisible(!this.state.modalVisible)} />
                    </View>

                    </TouchableHighlight>

                </View>
            );
        }
        else {
            return (
                <View>
                    <Text>Loading... </Text>
                </View>
            )
        }
    }
}

module.exports = ReactionModal;