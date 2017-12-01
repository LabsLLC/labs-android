import * as firebase from "firebase";

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

}

module.exports = Database;