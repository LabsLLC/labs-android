import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import styles from './styles'
import Database from '../../lib/Database.js'

class ReactionModal extends Component {
    constructor(props) {
        super(props);
        this.postReaction = this.postReaction.bind(this);

        this.state = {
            modalVisible: false,
        };
    }

    postReaction(complete, reaction, experiment_id){
        //Add the reaction to the user
        Database.addDailyReaction(complete, reaction).then(() => {
            Database.calculateUserSatisfaction(experiment_id);
            this.setModalVisible(!this.state.modalVisible);
            this.props.callback()
        });

    }


    //Here, we want to pass another variable depending on what emoji we clicked - Then send the data to the database!
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    render() {
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
                                        <TouchableOpacity onPress={() => {
                                            this.postReaction(1, 0, experiment_id);
                                        }}>
                                            <View>
                                                <Icon
                                                    size={100}
                                                    name='sentiment-very-dissatisfied'
                                                    color="#be0002"/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.emojiToken} >
                                        <TouchableOpacity onPress={() => {
                                            this.postReaction(1, .5, experiment_id);
                                        }}>
                                            <View>
                                                <Icon
                                                    size={100}
                                                    name='sentiment-neutral'
                                                    color='#00aced' />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.emojiToken} >
                                        <TouchableOpacity onPress={() => {
                                            this.postReaction(1, 1, experiment_id);
                                        }}>
                                            <View>
                                                <Icon
                                                    size={100}
                                                    name='sentiment-very-satisfied'
                                                    color="#1dab00"/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </View>
                    </Modal>

                    <TouchableOpacity onPress={() => {
                        this.setModalVisible(true)
                    }}>

                    <View>
                        <ListItem
                            leftIcon={{name: this.props.experimentInfo.icon}}
                            key={this.props.experimentInfo.index}
                            title={this.props.experimentInfo.name}
                            onPress={() => this.setModalVisible(!this.state.modalVisible)} />
                    </View>

                    </TouchableOpacity>

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