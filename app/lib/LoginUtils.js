import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation'
import Screens from '../config/navigationNames'

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

    /**
     * Navigates to the home page and clears the stack
     */
    static navigateLogin(navigation)
    {
        navigation.dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: Screens.Authenticated})]
        }));
    }

    /**
     * Navigates to the login page and clears the stack
     */
    static navigateLogout(navigation)
    {
        navigation.dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: Screens.Login})]
        }));
    }
}
