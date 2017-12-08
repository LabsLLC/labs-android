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
            <TouchableOpacity style={{flex: 1, flexDirection:"row", marginTop: 24}} onPress={this.props.onPress}>
                <View style={{marginTop: 4, marginLeft:20}}>
                    <Image style={{width:16, height:23.58}} source={require('../../images/icons/mappinalternate.png')} />
                </View>
                <View style={{flex: 2, marginLeft: 20, flexDirection:"column"}}>
                    <Text style={styles.contentText}>{this.props.content}</Text>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
                <Image style={{marginTop:8, height:28.6, width:16, marginLeft: 16, marginRight: 20}}
                       source={require('../../images/icons/chevronright.png')} />
            </TouchableOpacity>
        )
    }
}