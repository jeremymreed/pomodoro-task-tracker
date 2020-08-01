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
  }

  // Called by Timer, to pass in its getTotalTimeRan function, so we can call it here.
  submitGetTotalTimeRan(getTotalTimeRan) {
    this.getTotalTimeRan = getTotalTimeRan;
  }

  // Timer tells us it has expired.
  handleTimerExpiration() {
    this._stopTimer();
    this.props.updateTask(this.getTotalTimeRan(), false);
  }

  // User wants to pause the timer.
  handlePause(event) {
    event.preventDefault();

    this._stopTimer();
    this.props.updateTask(this.getTotalTimeRan(), false);
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
    this.props.updateTask(this.getTotalTimeRan(), false);
    this.props.stopTask();
  }

  taskDone(event) {
    event.preventDefault();

    this._stopTimer();
    this.props.updateTask(this.getTotalTimeRan(), true);
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
        <p>This task is running hot!</p>
        <Timer shouldRun={ this.state.shouldRun } handleTimerExpiration={ this.handleTimerExpiration } submitGetTotalTimeRan={ this.submitGetTotalTimeRan }/>
        <p>Task Name: { this.props.task.name }</p>
        <p>Task Description: { this.props.task.description }</p>
        <p>{ pauseResumeButton }</p>
        <p><button onClick={(e) => this.stopTask(e)}>Stop</button><button onClick={(e) => this.taskDone(e)}>Done</button></p>
      </div>
    );
  }
}

TaskRunningView.propTypes = {
  task: PropTypes.object,
  updateTask: PropTypes.func,
  stopTask: PropTypes.func
}

export default TaskRunningView;
