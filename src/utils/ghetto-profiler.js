import moment from 'moment';
import humanizeDuration from 'humanize-duration';

class GhettoProfiler {
  constructor(name) {
    this.name = name;
    this.start = null;
    this.end = null;
  }

  start() {
    if (this.start === null) {
      this.start = moment();
    } else {
      throw new Error('Cannot start running profiler when it has already been started!');
    }
  }

  stop() {
    if (this.start !== null) {
      this.end = moment();
    } else {
      throw new Error('Cannot stop running profiler when it has not been started!');
    }
  }

  status() {
    if (this.start !== null && this.stop !== null) {
      console.log(`Profiler ${this.name} ran for ${humanizeDuration(this.stop.diff(this.start), {round: false, maxDecimalPoints: 0, units: ['h', 'm', 's', 'ms']})}`)
    }
  }
}

export default GhettoProfiler;
