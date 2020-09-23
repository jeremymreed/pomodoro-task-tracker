/*
Copyright © 2020 Jeremy M. Reed

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

import React from 'react';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Pomodoro from '../utils/pomodoro';
import TimeConverter from '../utils/time-converter';

interface Props {
  shouldRun: boolean,
  submitGetTotalTimeRan: Function,
  submitGetCurrentPhaseType: Function,
  handleTimerExpiration: Function
}

interface State {
  numPomodoros: number,
  time: moment.Duration,
  type: string,
  title: string
}

class Timer extends React.Component<Props, State> {
  pomodoro: Pomodoro
  totalTimeRan: number
  interval: NodeJS.Timeout | null

  constructor(props: Props) {
    super(props);

    this.pomodoro = new Pomodoro();
    this.interval = null;

    this.updateDate = this.updateDate.bind(this);
    this.getTotalTimeRan = this.getTotalTimeRan.bind(this);
    this.getCurrentPhaseType = this.getCurrentPhaseType.bind(this);
    this.totalTimeRan = 0;

    const initialPhase = this.pomodoro.getNextTimerSetting();

    this.state = {
      numPomodoros: 0,
      time: moment.duration(initialPhase.length, 'seconds'),
      type: initialPhase.type,
      title: initialPhase.title
    }
  }

  updateDate() {
    if (this.props.shouldRun) {
      this.totalTimeRan += 1;

      // Timer should run, and has not expired.
      if (this.props.shouldRun && !(this.state.time.minutes() === 0 && this.state.time.seconds() === 0)) {
        this.setState({time: this.state.time.subtract(1, 'second')});
      }

      // TImer should run, and has expired.
      if (this.props.shouldRun && this.state.time.minutes() === 0 && this.state.time.seconds() === 0) {
        this.props.handleTimerExpiration(this.state.type);
        if (this.state.type === 'Work') {
          this.setState({
            numPomodoros: this.state.numPomodoros + 1
          });
        }
        const nextPhase = this.pomodoro.getNextTimerSetting();
        this.setState(
          {
            time: moment.duration(nextPhase.length, 'seconds'),
            type: nextPhase.type,
            title: nextPhase.title
          });
      }
    }
  }

  componentDidMount() {
    this.props.submitGetTotalTimeRan(this.getTotalTimeRan);
    this.props.submitGetCurrentPhaseType(this.getCurrentPhaseType);
    this.interval = setInterval(() => this.updateDate(), 1000);
  }

  componentWillUnmount() {
    if (this.interval != null) {
      clearInterval(this.interval);
    }
  }

  // Reset to zero when consumed.  We may continue running this timer.
  // Resetting eliminates a bug where an incorrect time will be reported when the user clicks pause, then stop.
  // This behavior is also seen when letting the timer expire, and the user clicks stop.
  //   Both actions result in an update to the task, and both handlers call this function!
  getTotalTimeRan() {
    const totalTimeRan = this.totalTimeRan;
    this.totalTimeRan = 0;
    return totalTimeRan;
  }

  getCurrentPhaseType() {
    return this.state.type;
  }

  render() {
    return (
      <div>
        <Typography align="center" variant="h1">
          {this.state.title}: { TimeConverter.getAsMinutes(this.state.time) }:{ TimeConverter.getSeconds(this.state.time) }
        </Typography>
        <Typography align="center">
          Number of Pomodoros: {this.state.numPomodoros}
        </Typography>
      </div>
    );
  }
}

export default Timer;