import firebase from 'react-native-firebase';
import TimeUtils from './TimeUtils'

class Database {


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
     * Sets a users experiment - then also update the experiment's active users
     * @param experimentId
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static setUserExperiment(experimentId, userCurrentExperimentID) {
        return new Promise( (success, fail) => {

            //Retrieve current users id
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    var id = user.uid;
                    let userHomePath = "/user/" + id; //update this user's experimentID
                    var today = TimeUtils.getTime();
                    firebase.database().ref(userHomePath).update({
                        experiment_id: experimentId,
                        start_date: today
                    })

                    //Update this experiment's active user count
                    let dailyReactionPath = "/experiment/" + experimentId;
                    success(firebase.database().ref(dailyReactionPath).child('active_user_count').transaction(function (currentValue) {
                        return (currentValue || 0) + 1
                    }));
                }
            });
        })
    }

    /**
     * Remove a user form the active user count for an experiment
     * @param userCurrentExperimentID
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static unsubscribeUser(userCurrentExperimentID) {
        return new Promise( (success, fail) => {

            //Update this experiment's active user count
            let dailyReactionPath = "/experiment/" + userCurrentExperimentID;
            success(firebase.database().ref(dailyReactionPath).child('active_user_count').transaction(function (currentValue) {
                return (currentValue || 0) - 1
            }));

        });

    }


    /**
     * Sets a users reaction for the day
     * @param cpmpleted
     * @param reaction double on how the user felt
     * @param pass the expe
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static addDailyReaction(completed, reaction) {
        return new Promise( (success, fail) => {
            //Retrieve current users id
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    var id = user.uid;
                    var today = TimeUtils.getTime();

                    let dailyReactionPath = "/user/" + id + "/reactions/" + today;
                    success( firebase.database().ref(dailyReactionPath).update({
                        completed: completed,
                        reaction: reaction
                    }))
                }
            });
        });
    }

    /**
     * Calculates a user's satisfaction based off of their reactions to an experiment
     * @param cpmpleted
     * @param reaction double on how the user felt
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static calculateUserSatisfaction(experiment_id) {
        return new Promise( (success, fail) => {
            firebase.auth().onAuthStateChanged((user) => { //Retrieve current users id
                if(user) {
                    var id = user.uid;
                    let userPath = "/user/" + id ;

                    //get the user's reactions -> then average them
                    this.getMyExperimentData().then((userExperimentData) => {
                        var reactions = userExperimentData.reactions;
                        let sum = 0, count = 0;
                        Object.keys(reactions).forEach((key) => {
                           sum += reactions[key].reaction;
                           count += 1;
                        });
                        satisfaction = sum / count;

                        //post user satisfaction
                        success( firebase.database().ref(userPath).update({
                            satisfaction: satisfaction
                        }).then(() => {
                            this.calculateExperimentSatisfaction(experiment_id);
                        }))
                    })
                }
            });
        })
    }

    /**
     * Calculates an experiments atisfaction based off of user's reactions to an experiment
     * @param cpmpleted
     * @param reaction double on how the user felt
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static calculateExperimentSatisfaction(experiment_id) {
        console.log("experiment_id: "+experiment_id);
        return new Promise( (success, fail) => {
            firebase.auth().onAuthStateChanged((user) => { //Retrieve current users id
                if(user) {
                    let experimentPath = "/experiment/" + experiment_id ;

                    //get the user's reactions -> then average them&&&&&&&&&&&&&&
                    this.getAllUserExperimentData(experiment_id).then((userExperimentSatisfactionData) => {


                        //calculate the overall satisfaction
                        let sum = 0, count = 0;
                        userExperimentSatisfactionData.map((userSatisfaction) => {
                            sum += userSatisfaction;
                            count += 1;
                        });
                        var experimentSatisfaction = sum / count;

                        //post it in the experiment
                        success( firebase.database().ref(experimentPath).update({
                            total_satisfaction: experimentSatisfaction
                        }))
                    })
                }
            });
        })
    }

    /**
     * Gets all users satisfaction ratings for a given experiment
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static getAllUserExperimentData(experiment_id) {
        return new Promise( (success, fail) => {
            let userPath = "/user/"  ;
            return firebase.database().ref(userPath).on('value', (data) => {

                //convert data to an array
                var userList =[]
                data.forEach(function(data) {

                    //Filter out all but given experiment id - also filter out any nulls - this would indicate that a user has subscribed to an experiment, but hasn't posted any reactions yet
                    if(data.val().experiment_id == experiment_id && data.val().satisfaction){
                        userList.push(data.val().satisfaction);
                    }
                });
                success(userList);
            });

        })
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

                        success(snapshot.val());
                    });
                }
            });
        })
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
                data.forEach(function(data) {
                    var x = {id: data.key, val: data.val()};
                    list.push(x);
                });

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

        console.log("experiment_id: "+experiment_id);
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
