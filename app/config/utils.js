import WakeUpImagePath from '../images/experiments/wakeupearly.png';
import ExerciseImagePath from '../images/experiments/exercise.png';
import MeditationImagePath from '../images/experiments/meditation.png';
import JournalImagePath from '../images/experiments/journal.png';



export default class ExperimentImages {
    static WakeUpImage = WakeUpImagePath;
    static ExerciseImage = ExerciseImagePath;
    static MeditationImage = MeditationImagePath;
    static JournalImage = JournalImagePath;

    static getImage(name){

        let image = null;

        switch(name) {
            case "Journaling":
                image = this.JournalImage;
                break;
            case "Wake up early":
                image = this.WakeUpImage;
                break;
            case "Daily Exercise":
                image = this.ExerciseImage;
                break;
            case "Meditation":
                image = this.MeditationImage;
                break;

        }
        return image;
    }

}