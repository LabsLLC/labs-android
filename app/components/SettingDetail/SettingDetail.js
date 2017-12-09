import React, { Component } from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import styles from './styles'

/**
 * Props:
 *      onPress
 *
 */
export default class SettingDetail extends Component
{
    constructor(props) {
        super(props);
        console.log("IN SIDE constructor");

    }

    render()
    {
        console.log("IN SIDE Setting Detail");
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
                <Image style={styles.listIcon} source={require('../../images/icons/mappinalternate.png')} />
                <View style={styles.textStack}>
                    <Text style={styles.contentText}>{this.props.content}</Text>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
                <Image style={styles.chevron}
                       source={require('../../images/icons/chevronright.png')} />
            </TouchableOpacity>
        )
    }
}