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
    }

    render()
    {
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
                <Image style={styles.listIcon} source={require('../../images/icons/mappinalternate.png')} />
                <View style={}>
                    <Text style={styles.contentText}>{this.props.content}</Text>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
                <Image style={styles.chevron}
                       source={require('../../images/icons/chevronright.png')} />
            </TouchableOpacity>
        )
    }
}