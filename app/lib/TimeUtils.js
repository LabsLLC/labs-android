

class TimeUtils {
    /**
     * Get the current date
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static getTime() {
        //calculate today's date
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10)
            dd = '0'+dd
        if(mm<10)
            mm = '0'+mm
        today = mm + '_' + dd + '_' + yyyy;

        return today
    }

}

module.exports = TimeUtils;
