import React, { Component } from 'react';
import { View,  TouchableOpacity, Image, ScrollView } from 'react-native';
import styles from './styles'

export default class TabIcon extends Component<{}> {

    constructor(props) {
        super(props);
    }

    render() {
        return(
        <TouchableOpacity style={{width: 30, height: 30}} onPress={this.props.onPress}>
            {this.props.isActive ?
                <Image style={{width: 30, height: 30}}
                       source={this.props.selectedIcon}
                />
                :
                <Image style={{width: 30, height: 30}}
                       source={this.props.inactiveIcon}
                />
            }
        </TouchableOpacity>
      );
    }
}