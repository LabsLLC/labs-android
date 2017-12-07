import WakeUpImagePath from '../images/experiments/wakeupearly.png';
import ExerciseImagePath from '../images/experiments/exercise.png';
import MeditationImagePath from '../images/experiments/meditation.png';


export default class ExperimentImages {
    static WakeUpImage = WakeUpImagePath;
    static ExerciseImage = ExerciseImagePath;
    static MeditationImage = MeditationImagePath;

    static getImage(name){

        let image = null;

        switch(name) {
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