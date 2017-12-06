import firebase from 'react-native-firebase';


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
     * @param userId
     * @param experimentId
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static setUserExperiment(userId, experimentId) {

        var user = firebase.auth().currentUser;

        if (user) {
            // User is signed in.
            console.log("User is signed in: "+ JSON.stringify(user));
            var token = user.getIdToken();
            console.log("TOKEN: "+  JSON.stringify(token));
        } else {
            // No user is signed in.
            console.log("User is NOT signed in");
        }


        /*let userHomePath = "/user/" + userId;
        return firebase.database().ref(userHomePath).set({
            experimentId: experimentId
        })*/
        return

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

            var playersRef = firebase.database().ref("experiment/");

            return playersRef.orderByChild("name").on("value", function (data) {

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
