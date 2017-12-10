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
            {'page' in this.props && this.props.page === "HomePage" ?
                <Image style={{width: 30, height: 30}}
                       source={this.props.selected}
                />
                :
                <Image style={{width: 30, height: 30}}
                       source={this.props.inactive}
                />
            }
        </TouchableOpacity>
      );
    }
}