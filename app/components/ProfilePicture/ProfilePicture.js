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
                <View style={styles.backgroundCircle}>
                    <TouchableOpacity onPress={() => this.props.onPress()}>
                        <Image style={styles.image} onClick="onProfileClick" source={{uri: this.props.profileImage}}/>
                    </TouchableOpacity>
                </View>
        )
    }
}