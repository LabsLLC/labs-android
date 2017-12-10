import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from './styles'

const TitledInput = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {

    return (
        <View style={styles.containerStyle}>
            <Text style={styles.labelStyle}>{label.toUpperCase()}</Text>
            <TextInput
                autoCorrect={false}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                style={styles.inputStyle}/>
        </View>
    );
};

module.exports = TitledInput;