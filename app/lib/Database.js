import firebase from 'react-native-firebase';
import TimeUtils from './TimeUtils'

class Database {


    static createUser(){

    }

    /**
     * Sets a users home address
     * @param userId
     * @param userHome
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static setUserHomeAddress(userId, userHome) {

        let userHomePath = "/user/" + userId;
        return firebase.database().ref(userHomePath).set({
            userHome: userHome
        })

    }

    /**
     * Sets a users experiment
     * @param experimentId
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static setUserExperiment(experimentId) {
        //Retrieve current users id
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                var id = user.uid;
                let userHomePath = "/user/" + id; //update this user's experimentID
                var today = TimeUtils.getTime();
                return firebase.database().ref(userHomePath).update({
                    experiment_id: experimentId,
                    start_date: today
                })
            }
        });
    }

    /**
     * Sets a users reaction for the day
     * @param cpmpleted
     * @param reaction double on how the user felt
     * @param pass the expe
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static addDailyReaction(experiment_id, completed, reaction) {
        //Retrieve current users id
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                var id = user.uid;
                var today = TimeUtils.getTime();

                let dailyReactionPath = "/user/" + id + "/reactions/" + today;
                return firebase.database().ref(dailyReactionPath).update({
                    completed: completed,
                    reaction: reaction
                })
            }
        });
    }

    /**
     * Gets a users experiment data (get the ID, reactions, days etc)
     * @param cpmpleted
     * @param reaction double on how the user felt
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static getMyExperimentData() {
        return new Promise( (success, fail) => {
            firebase.auth().onAuthStateChanged((user) => { //Retrieve current users id

                if(user) {
                    var id = user.uid;
                    let experimentPath = "/user/" + id ;
                    return firebase.database().ref(experimentPath).on('value', (snapshot) => {

                        var myExperimentData = JSON.stringify(snapshot.val());
                        console.log("myExperimentData: "+myExperimentData);
                        success(snapshot.val());
                    });
                }
            });
        })
    }

    /**
     * Sets a userID in the database
     * @param userId
     * @returns {firebase.Promise.<void>}
     */
    static setUserID(userId) {
        var userHomePath = "/user/";
        return firebase.database().ref(userHomePath).set({
            userId: userId
        })
    }

    /**
     * Listen for changes to a users mobile number
     * @param userId
     * @param callback Users mobile number
     */
    static listenUserHome(userId, callback) {

        let userHomePath = "/user/" + userId + "/details";

        firebase.database().ref(userHomePath).on('value', (snapshot) => {

            var mobile = "";

            if (snapshot.val()) {
                userHome = snapshot.val().userHome
            }
            callback(userHome)
        });
    }


    /**
     * getExperiments - get the first 10 or so experiments
     *
     */
    static getExperiments() {
        return new Promise(function (success, fail) {
            console.log("getExperiments: ");

            var experimentRef = firebase.database().ref("experiment/");

            return experimentRef.orderByChild("name").on("value", function (data) {

                var list =[]
                var i = 0;
                data.forEach(function(data) {
                    var x = {id: data.key, val: data.val()};
                    list.push(x);
                });

                //console.log(JSON.stringify(data.val()));
                success(list);
            });
        })
    }

    /**
     * Gets a users experiment information
     * @param cpmpleted
     * @param reaction double on how the user felt
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static getMyExperimentInfo(experiment_id) {

        return new Promise( (success, fail) => {

            //Retrieve current users id
            firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    let experimentPath = "/experiment/" + experiment_id;
                    return firebase.database().ref(experimentPath).on('value', (snapshot) => {
                        var experimentInfo = JSON.stringify(snapshot.val());
                        console.log("experimentInfo: "+experimentInfo);
                        success(snapshot.val());
                    });
                }
            });
        })
    }

    static getUserAddress(userId) {
        return new Promise( (success, fail) => {
            const userHomePath = "user/" + userId + "/userHome/";
            console.log(userHomePath);
            return firebase.database().ref(userHomePath).on('value', (snapshot) => {
                var home = JSON.stringify(snapshot.val());
                success(home);
            });
        })
    }

    static experimentTest()
    {
        console.log("Ran");
        let userHomePath = "experiment/";

        firebase.database().ref(userHomePath).on('value', (snapshot) => {
            console.log(snapshot.val())
        });
    }
}

module.exports = Database;
