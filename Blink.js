import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';

class Blink extends Component {
    constructor(props) {
        super(props);
        this.state = {showText: true};

        // Toggle the state every second
        setInterval(() => {
            this.setState(previousState => {
                return { showText: !previousState.showText };
            });
        }, 1000);
    }

    render() {
        let display = this.state.showText ? this.props.text : this.props.text;
        let words = null;
        if(this.state.showText){
            words =  <Text style={styles.red}>{display}</Text>;
        } else {
            words =  <Text style={styles.blue}>{display}</Text>;
        }
        return (
            words
           // <Text style={styles.red}>{display}</Text>
        );
    }
}
const styles = StyleSheet.create({
    bigblue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
    },
    red: {
        color: 'red',
    },
    blue: {
        color: 'blue',
    },
});

module.exports = Blink;