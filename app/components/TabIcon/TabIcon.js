import React, { Component } from 'react';
import { View,  TouchableOpacity, Image, ScrollView } from 'react-native';
import styles from './styles'

export default class TabIcon extends Component<{}> {

    constructor(props) {
        super(props);
    }

    render() {
        return(
        <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
            {this.props.isActive ?
                <Image style={styles.icon}
                       source={this.props.selectedIcon}
                />
                :
                <Image style={styles.icon}
                       source={this.props.inactiveIcon}
                />
            }
        </TouchableOpacity>
      );
    }
}