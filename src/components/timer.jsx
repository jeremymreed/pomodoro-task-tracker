import React from 'react';

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.updateDate = this.updateDate.bind(this);

    this.state = {
      date: new Date()
    }
  }

  updateDate() {
    this.setState({date: new Date()});
  }

  componentDidMount() {
    this.interval = setInterval(() => this.updateDate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Date: { this.state.date.toISOString() }
      </div>
    );
  }
}

export default Timer;
