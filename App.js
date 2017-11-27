/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  Image,
    ListView,
} from 'react-native';
import Blink from './Blink';


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
        console.log("Num Movies: "+this.state.numberOfMovies);

        let titleText = "Movies: "+this.state.numberOfMovies;
        return (

            //<Text> Movies: {this.state.numberOfMovies} </Text>
            <View >
              <Blink style={styles.titleContainer} text={titleText} />

              <Text style={styles.titleContainer}> Movies: {this.state.numberOfMovies} </Text>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderMovie}
                style={styles.listView}
              />
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