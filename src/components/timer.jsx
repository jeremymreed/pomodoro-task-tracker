import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Pomodoro from '../utils/pomodoro';

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.pomodoro = new Pomodoro();

    this.updateDate = this.updateDate.bind(this);
    this.timerStatus = this.timerStatus.bind(this);

    this.state = {
      time: moment.duration(this.pomodoro.getNextTimerSetting(), 'seconds')
    }
  }

  updateDate() {
    if (this.props.shouldRun && !(this.state.time.minutes() === 0 && this.state.time.seconds() === 0)) {
      this.setState({time: this.state.time.subtract(1, 'second')});
    }

    if (this.props.shouldRun && this.state.time.minutes() === 0 && this.state.time.seconds() === 0) {
      this.setState({time: moment.duration(this.pomodoro.getNextTimerSetting(), 'seconds')});
      this.props.handleTimerExpiration();
    }
  }

  componentDidMount() {
    this.props.submitTimerStatus(this.timerStatus);
    this.interval = setInterval(() => this.updateDate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getMinutes() {
    if (this.state.time.minutes() < 10 ) {
      return `0${this.state.time.minutes()}`;
    } else {
      return `${this.state.time.minutes()}`;
    }
  }

  getSeconds() {
    if (this.state.time.seconds() < 10 ) {
      return `0${this.state.time.seconds()}`;
    } else {
      return `${this.state.time.seconds()}`;
    }
  }

  timerStatus() {
    return (this.pomodoro.getCurrentTimerSetting() - this.state.time.asSeconds());
  }

  render() {
    return (
      <div>
        Time remaning { this.getMinutes() } : { this.getSeconds() }
      </div>
    );
  }
}

Timer.propTypes = {
  shouldRun: PropTypes.bool,
  submitTimerStatus: PropTypes.func,
  handleTimerExpiration: PropTypes.func
}

export default Timer;
