

class Utils {
    /**
     * Get the current date
     * @returns string
     */
    static getTime() {
        //calculate today's date
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();


        dd-= 0;
        if(dd<10)
            dd = '0'+dd;
        if(mm<10)
            mm = '0'+mm;
        today = yyyy+ '-' +mm + '-' + dd;
        console.log("CALCULATING TIME: "+today);
        return today
    }





}

module.exports = Utils;
