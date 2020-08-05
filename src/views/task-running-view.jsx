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
import Timer from '../components/timer';

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
    let pauseResumeButton = '';
    if (this.state.shouldRun) {
      pauseResumeButton = <button onClick={(e) => this.handlePause(e)}>Pause</button>;
    } else {
      pauseResumeButton = <button onClick={(e) => this.handleResume(e)}>Resume</button>;
    }
    return (
      <div>
        <div>
          <span><span className="active-task-style">Active Task:</span> { this.props.task.name }  <Timer shouldRun={ this.state.shouldRun } handleTimerExpiration={ this.handleTimerExpiration } submitGetTotalTimeRan={ this.submitGetTotalTimeRan }/>  { pauseResumeButton }</span>
        </div>
        <p>Description:</p>
        <textarea className="description-size description-style" value={ this.props.task.description } readOnly={ true } />
        <p><button onClick={(e) => this.stopTask(e)}>Stop</button><button onClick={(e) => this.taskDone(e)}>Done</button></p>
      </div>
    );
  }
}

TaskRunningView.propTypes = {
  task: PropTypes.object,
  updateTaskTimeSpentOnTask: PropTypes.func,
  taskDone: PropTypes.func,
  stopTask: PropTypes.func
}

export default TaskRunningView;
