import React from 'react';
import PropTypes from 'prop-types';
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
    let seconds = this.getTotalTimeRan();
    console.log('TaskRunningView: _stopTimer: seconds:', seconds);
    return (seconds);
  }

  // Called by Timer, to pass in its getTotalTimeRan function, so we can call it here.
  submitGetTotalTimeRan(getTotalTimeRan) {
    this.getTotalTimeRan = getTotalTimeRan;
  }

  // Timer tells us it has expired.
  handleTimerExpiration() {
    this._stopTimer();
  }

  // User wants to pause the timer.
  handlePause(event) {
    event.preventDefault();

    this._stopTimer();
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

    this.props.stopTask(this._stopTimer());
  }

  taskDone(event) {
    event.preventDefault();

    this.props.taskDone(this._stopTimer());
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
        <p>This task is running hot!</p>
        <Timer shouldRun={ this.state.shouldRun } handleTimerExpiration={ this.handleTimerExpiration } submitGetTotalTimeRan={ this.submitGetTotalTimeRan }/>
        <p>Task Name: { this.props.task._name }</p>
        <p>Task Description: { this.props.task._description }</p>
        <p>{ pauseResumeButton }</p>
        <p><button onClick={(e) => this.stopTask(e)}>Stop</button><button onClick={(e) => this.taskDone(e)}>Done</button></p>
      </div>
    );
  }
}

TaskRunningView.propTypes = {
  task: PropTypes.object,
  stopTask: PropTypes.func,
  taskDone: PropTypes.func
}

export default TaskRunningView;
