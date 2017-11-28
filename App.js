/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Card, Button, Text, Header } from 'react-native-elements';
import * as firebase from 'firebase';
import { Platform, StyleSheet, View, AppRegistry, Image, ListView} from 'react-native';
//import Blink from './Blink';
import { google } from 'react-native-simple-auth';



var MOCKED_MOVIES_DATA = [
    {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];

/**
 * For quota reasons we replaced the Rotten Tomatoes' API with a sample data of
 * their very own API that lives in React Native's Github repo.
 */
var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';



const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDw-gKR_SGlQwrK7EpC30jvl2Jx5tPIyV8",
    authDomain: "labs-c6f2f.firebaseapp.com",
    databaseURL: "https://labs-c6f2f.firebaseio.com/",
    storageBucket: "labs-c6f2f.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class App extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false,
            numberOfMovies: null
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    signUp() {

        google({
            appId: '579433277918-8ks1ufi6s83c8erld858uq4ek17q8fk3.apps.googleusercontent.com',
            callback: 'com.awesomeproject:/oauth2redirect',
            //callback: 'com.awesomeproject',

        }).then((info) => {
            // info.user - user details from the provider
            // info.credentials - tokens from the provider
            console.log("******************************************GOOOD");
        }).catch((error) => {
            // error.code
            // error.description
            console.log("******************************************BADDD");
        });


    }

    fetchData() {
        fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
                    loaded: true,
                    numberOfMovies: responseData.total,
                });
            })
            .done();
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        let titleText = "Movies: "+this.state.numberOfMovies;
        return (

            //<Text> Movies: {this.state.numberOfMovies} </Text>
            <View >

                <Header
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'Labs', style: { color: '#fff' } }}
                    rightComponent={{ icon: 'home', color: '#fff' }}
                />


                <Card
                    title='HELLO WORLD'
                    //image={require('../images/pic2.jpg')}
                >
                    <Text style={{marginBottom: 10}}>
                        The idea with React Native Elements is more about component structure than actual design.
                    </Text>
                    <Button
                        icon={{name: 'envira', type: 'font-awesome'}}
                        backgroundColor='#03A9F4'
                        fontFamily='Lato'
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                        title={`Sign in with Google`}
                        onPress={this.signUp}/>
                </Card>

            </View>
        );
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
              <Text>
                Loading movies...
              </Text>
            </View>
        );
    }

    renderMovie(movie) {
        return (
            <View style={styles.container}>



              <Image
                  source={{uri: movie.posters.thumbnail}}
                  style={styles.thumbnail}
              />
              <View style={styles.rightContainer}>
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.year}>{movie.year}</Text>
              </View>
            </View>
        );
    }



}

const styles = StyleSheet.create({
    titleContainer: {
        textAlign: 'center',
        fontSize: 20,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    thumbnail: {
        width: 53,
        height: 81,
    },
    rightContainer: {
        flex: 1,
        backgroundColor: '#BFFCFF'
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    year: {
        textAlign: 'center',
    },
    listView: {
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
    },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);


/*

<Blink style={styles.titleContainer} text={titleText} />
         <Text style={styles.titleContainer}> Movies: {this.state.numberOfMovies} </Text>


<ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderMovie}
                style={styles.listView}
              />

    render() {
    var movie = MOCKED_MOVIES_DATA[0];

    return (
        <View style={styles.container}>
          <Image
              source={{uri: movie.posters.thumbnail}}
              style={styles.thumbnail}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.year}>{movie.year}</Text>
          </View>
        </View>
    );
  }*/
/*
OLD View
 <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>

 */