import React from 'react';
import moment from 'moment';

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.updateDate = this.updateDate.bind(this);

    this.state = {
      time: moment.duration(5, 'seconds')
    }
  }

  updateDate() {
    if (!(this.state.time.minutes() === 0 && this.state.time.seconds() === 0)) {
      this.setState({time: this.state.time.subtract(1, 'second')});
    }
  }

  componentDidMount() {
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

  render() {
    return (
      <div>
        Time remaning { this.getMinutes() } : { this.getSeconds() }
      </div>
    );
  }
}

export default Timer;
