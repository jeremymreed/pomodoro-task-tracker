// This class will execute the Pomodoro technique.
// The timer will ask this class for the 'next setting for the timer'.
// This class determines what that should be.

// Definitions:
// A Set has a number of Intervals.
// An Interval is a number of phases.
// A Phase is some duration of time. (number of seconds);
class Pomodoro {
  constructor() {
    // These are in seconds.
    this.currentPhase = 0;
    // TODO: These should be in a settings file.  Something like settings.json.
    this.pomodoro = 5;
    this.shortRest = 2;
    this.longRest = 4;

    this.intervalsInSet = 4;
    this.interval = 0;
    this.intervalArray = [];

    this.setupInterval();
  }

  setupInterval() {
    if (this.interval !== this.intervalsInSet - 1) {
      this.intervalArray.push(this.shortRest);
    } else {
      this.intervalArray.push(this.longRest);
    }

    this.intervalArray.push(this.pomodoro);
  }

  // Returns current phase.
  // For initial state, call this one.
  getCurrentTimerSetting() {
    return (this.currentPhase);
  }

  // Goes to next phase, starts that phase.
  getNextTimerSetting() {
    console.log('Pomodoro: getNextTimerSetting called');
    console.log('Pomodoro: getNextTimerSetting: this.interval:', this.interval);
    console.log('Pomodoro: getNextTimerSetting: this.intervalArray', this.intervalArray);
    if (this.intervalArray.length === 0) {
      if (this.interval === 3) {
        this.interval = 0;
      } else {
        this.interval = this.interval + 1; // TODO: Bug here?
      }
      this.setupInterval();
    }

    this.currentPhase = this.intervalArray.pop();
    console.log('Pomodoro: getNextTimerSetting: this.interval:', this.interval);
    console.log('this.currentPhase: ', this.currentPhase);
    return (this.currentPhase);
  }
}

export default Pomodoro;
