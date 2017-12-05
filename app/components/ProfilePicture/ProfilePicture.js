import React, { Component } from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import styles from './styles'

/**
 * Props:
 *      onPress
 *
 */
export default class ProfilePicture extends Component
{
    constructor(props) {
        super(props);
    }

    render()
    {
        return (
            <TouchableOpacity onPress={() => this.props.onPress()}>
                <View style={styles.backgroundCircle}>
                    <Image style={styles.image} onClick="onProfileClick" source={{uri: this.props.profileImage}}/>
                </View>
            </TouchableOpacity>
        )
    }
}