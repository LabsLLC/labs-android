import firebase from 'react-native-firebase';
import Utils from './Utils'

class Database {


    /**
     * Sets a users home address
     * @param userId
     * @param userHome
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static setUserHomeAddress(userId, userHome) {

        let userHomePath = "/user/" + userId;
        return firebase.database().ref(userHomePath).update({
            userHome: userHome
        })
    }

    static setUserName(userId, name)
    {
        let userPath = "/user/" + userId;

        return firebase.database().ref(userPath).update({
            name: name
        });
    }

    static getAllUsers()
    {
        return new Promise( (success, fail) => {
            firebase.auth().onAuthStateChanged((user) => { //Retrieve current users id
                if(user) {
                    let userPath = "/user";
                    return firebase.database().ref(userPath).on('value', (snapshot) => {
                        success(snapshot.val());
                    });
                }
            });
        })
    }
    /**
     * Sets a users experiment - then also update the experiment's active users
     * @param experimentId
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static setUserExperiment(experimentId) {
        return new Promise( (success, fail) => {

            //Retrieve current users id
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    var id = user.uid;
                    let userHomePath = "/user/" + id; //update this user's experimentID
                    var today = Utils.getTime();
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
     * clears a users experiment
     * @param experimentId
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static clearUserExperiment() {
        return new Promise( (success, fail) => {

            //Retrieve current users id
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    var id = user.uid;
                    let userHomePath = "/user/" + id; //update this user's experimentID

                    success(firebase.database().ref(userHomePath).update({
                        experiment_id: null,
                        start_date: null
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

            if(userCurrentExperimentID !== null){
                //Update this experiment's active user count
                let dailyReactionPath = "/experiment/" + userCurrentExperimentID;
                success(firebase.database().ref(dailyReactionPath).child('active_user_count').transaction(function (currentValue) {
                    return (currentValue || 0) - 1
                }));
            }
        });
    }

    /**
     * Archive the user's data
     * @param userCurrentExperimentID
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static archiveUserData(userCurrentExperimentID) {
        return new Promise( (success, fail) => {
            let user = firebase.auth().currentUser;

            if (user) {
                var id = user.uid;
                var userPath = "/user/"+id;

                //extract the user's satisfaction rating
                firebase.database().ref(userPath).once('value', (data) => {

                    console.log("ARCHIVING DATA: "+ JSON.stringify(data.val()));
                    //Check to see if the user has a satisfaction for the experiment their subscribed to, if not, don't update their archive.
                    if(data.val().satisfaction || data.val().satisfaction === 0){
                        var userSatisfaction = data.val().satisfaction;

                        console.log("With userSatisfaction: "+userSatisfaction);
                        let archiveDataPath = "/user/" + id + "/archive_data/"+userCurrentExperimentID;
                        success( firebase.database().ref(archiveDataPath).update({
                            satisfaction: userSatisfaction
                        }).then(()=>{
                             this.clearActiveExperimentData()
                         }))
                    } else {
                        console.log("No data to archive");
                        success();
                    }
                });
            }

        });
    }

    /**
     * Archive the user's data
     * @param userCurrentExperimentID
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static clearActiveExperimentData() {
        return new Promise((success, fail) => {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    var id = user.uid;
                    var userPath = "/user/" + id;

                    success(firebase.database().ref(userPath).update({
                        reactions: null,
                        satisfaction: null
                    }))

                }
            });
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
                    var today = Utils.getTime();

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
                console.log("User satisfaction calculated.");

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
        //console.log("experiment_id: "+experiment_id);
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
                        var experimentSatisfaction;
                        if(count == 0)
                            experimentSatisfaction = 0; //delete this field for now
                        else
                            experimentSatisfaction = sum / count;

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
                    if('satisfaction' in data.val() && 'experiment_id' in data.val()){
                        if(data.val().experiment_id === experiment_id){
                            userList.push(data.val().satisfaction);
                        }
                    }
                    //Snatch all from the archives as well ;)
                    if('archive_data' in data.val()) {
                        //console.log("archive_data: "+JSON.stringify(data.val().archive_data));
                        Object.keys(data.val().archive_data).forEach((key) => {
                            //console.log('User has archieve data for experiment: ' + key);
                            if(key!==null && data.val().archive_data[key] !== null) {

                                if(key === experiment_id)  {
                                    if('satisfaction' in data.val().archive_data[key]){
                                        userList.push(data.val().archive_data[key].satisfaction)
                                    }
                                }
                            }
                        });
                    }

                });
                //console.log("ARCHIVE USER RATINGS: "+ JSON.stringify(userArchiveList));
                console.log("All USER RATINGS: "+ JSON.stringify(userList));

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

            return experimentRef.orderByChild("total_satisfaction").on("value", function (data) {

                var list =[]
                data.forEach(function(data) {
                    var x = {id: data.key, val: data.val()};
                    list.push(x);
                });

                list.reverse();

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

}

module.exports = Database;
