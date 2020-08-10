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
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Timer from '../components/timer';

const styles = () => ({
  pauseResumeButton: {
    marginTop: '5px',
    marginRight: '5px'
  },
  stopButton: {
    marginTop: '5px',
    marginLeft: '5px',
    marginRight: '5px'
  },
  doneButton: {
    marginTop: '5px',
    marginLeft: '5px'
  }
});

class TaskRunningView extends React.Component {
  constructor(props) {
    super(props);

    this.handleTimerExpiration = this.handleTimerExpiration.bind(this);
    this.submitGetTotalTimeRan = this.submitGetTotalTimeRan.bind(this);

    this.state = {
      shouldRun: true,
    }
  }

  _startTimer() {
    this.setState({shouldRun: true});
  }

  _stopTimer() {
    this.setState({shouldRun: false});
  }

  // Called by Timer, to pass in its getTotalTimeRan function, so we can call it here.
  submitGetTotalTimeRan(getTotalTimeRan) {
    this.getTotalTimeRan = getTotalTimeRan;
  }

  // Timer tells us it has expired.
  handleTimerExpiration() {
    this._stopTimer();
    this.props.updateTaskTimeSpentOnTask(this.getTotalTimeRan());
  }

  // User wants to pause the timer.
  handlePause(event) {
    event.preventDefault();

    this._stopTimer();
    this.props.updateTaskTimeSpentOnTask(this.getTotalTimeRan());
  }

  // User wants to resume the timer.
  handleResume(event) {
    event.preventDefault();

    this._startTimer();
  }

  // User wants to stop working on this task, and return to the task list.
  // This does not set the task as being 'done'.
  stopTask(event) {
    event.preventDefault();

    this._stopTimer();
    this.props.updateTaskTimeSpentOnTask(this.getTotalTimeRan());
    this.props.stopTask();

    ipcRenderer.send('showNotification', 'taskStopped');
  }

  // User is done with this task.
  taskDone(event) {
    event.preventDefault();

    this._stopTimer();
    this.props.updateTaskTimeSpentOnTask(this.getTotalTimeRan());
    this.props.taskDone();
    this.props.stopTask();
  }

  render() {
    const { classes } = this.props;
    let pauseResumeButton = '';
    if (this.state.shouldRun) {
      pauseResumeButton = <Button className={classes.pauseResumeButton} variant="outlined" color="primary" onClick={(e) => this.handlePause(e)}>Pause</Button>;
    } else {
      pauseResumeButton = <Button className={classes.pauseResumeButton} variant="outlined" color="primary" onClick={(e) => this.handleResume(e)}>Resume</Button>;
    }
    return (
      <div>
        <div>
          <span><span className="active-task-style">Active Task:</span> { this.props.task.name }</span>
        </div>
        <Timer shouldRun={ this.state.shouldRun } handleTimerExpiration={ this.handleTimerExpiration } submitGetTotalTimeRan={ this.submitGetTotalTimeRan }/>

        <TextField
          label="Description"
          disabled="true"
          multiline
          rows={4}
          defaultValue={ this.props.task.description }
          variant="outlined"
        />

        <p>
          { pauseResumeButton }
          <Button className={classes.stopButton} variant="outlined" color="primary" onClick={(e) => this.stopTask(e)}>Stop</Button>
          <Button className={classes.doneButton} variant="outlined" color="primary" onClick={(e) => this.taskDone(e)}>Done</Button>
        </p>
      </div>
    );
  }
}

TaskRunningView.propTypes = {
  classes: PropTypes.object,
  task: PropTypes.object,
  updateTaskTimeSpentOnTask: PropTypes.func,
  taskDone: PropTypes.func,
  stopTask: PropTypes.func
}

export default withStyles(styles)(TaskRunningView);
