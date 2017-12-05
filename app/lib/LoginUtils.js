import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Database from './Database';
import firebase from 'react-native-firebase';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

export default class LoginUtils
{
    /**
     * Authenticates a user via Facebook
     * @returns {Promise<RNFirebase.UserL>}
     */
    static getFacebookLoginPromise()
    {
        return LoginManager.logInWithReadPermissions(['public_profile', 'email'])
            .then((result) => {
                if (result.isCancelled) {
                    return Promise.reject(new Error('The user cancelled the request'));
                }

                console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
                // get the access token
                return AccessToken.getCurrentAccessToken();
            })
            .then(data => {
                // create a new firebase credential with the token
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

                // login with credential
               // callback();
                return firebase.auth().signInWithCredential(credential);
            })
    }
}
