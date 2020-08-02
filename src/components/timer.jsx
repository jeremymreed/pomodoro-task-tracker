import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Pomodoro from '../utils/pomodoro';

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.pomodoro = new Pomodoro();

    this.updateDate = this.updateDate.bind(this);
    this.getTotalTimeRan = this.getTotalTimeRan.bind(this);
    this.totalTimeRan = 0;

    this.state = {
      time: moment.duration(this.pomodoro.getNextTimerSetting(), 'seconds')
    }
  }

  updateDate() {
    if (this.props.shouldRun) {
      this.totalTimeRan += 1;

      if (this.props.shouldRun && !(this.state.time.minutes() === 0 && this.state.time.seconds() === 0)) {
        this.setState({time: this.state.time.subtract(1, 'second')});
      }

      if (this.props.shouldRun && this.state.time.minutes() === 0 && this.state.time.seconds() === 0) {
        this.props.handleTimerExpiration();
        this.setState({time: moment.duration(this.pomodoro.getNextTimerSetting(), 'seconds')});
      }
    }
  }

  componentDidMount() {
    this.props.submitGetTotalTimeRan(this.getTotalTimeRan);
    this.interval = setInterval(() => this.updateDate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getMinutes() {
    if (Math.trunc(this.state.time.asMinutes()) < 10 ) {
      return `0${Math.trunc(this.state.time.asMinutes())}`;
    } else {
      return `${Math.trunc(this.state.time.asMinutes())}`;
    }
  }

  getSeconds() {
    if (this.state.time.seconds() < 10 ) {
      return `0${this.state.time.seconds()}`;
    } else {
      return `${this.state.time.seconds()}`;
    }
  }

  // Reset to zero when consumed.  We may continue running this timer.
  // Resetting eliminates a bug where an incorrect time will be reported when the user clicks pause, then stop.
  // This behavior is also seen when letting the timer expire, and the user clicks stop.
  //   Both actions result in an update to the task, and both handlers call this function!
  getTotalTimeRan() {
    console.log('this.totalTimeRan:', this.totalTimeRan);
    const totalTimeRan = this.totalTimeRan;
    this.totalTimeRan = 0;
    return totalTimeRan;
  }

  render() {
    return (
      <div>
        Time remaining { this.getMinutes() } : { this.getSeconds() }
      </div>
    );
  }
}

Timer.propTypes = {
  shouldRun: PropTypes.bool,
  submitGetTotalTimeRan: PropTypes.func,
  handleTimerExpiration: PropTypes.func
}

export default Timer;
