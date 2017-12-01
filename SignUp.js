import React, { Component } from 'react';
import {Card} from 'react-native-elements';
import LoginForm from './LoginForm'


export default class SignUp extends Component<{}> {

    render() {
        return (
            <Card
                title='Welcome to Labs!'
            >
                <LoginForm SignUp ={true}/>
            </Card>
        )}
}

module.exports = SignUp;