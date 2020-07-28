import React from 'react';
import PropTypes from 'prop-types';
import Timer from '../components/timer';

class TaskRunningView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldRun: true,
    }
  }

  handleTimerExpiration() {
    this.setState({shouldRun: false});
  }

  stopTask(event) {
    event.preventDefault();

    this.props.stopTask();
  }

  render() {
    let pauseResumeButton = '';
    if (this.state.shouldRun) {
      pauseResumeButton = <button>Pause</button>;
    } else {
      pauseResumeButton = <button>Resume</button>;
    }
    return (
      <div>
        <p>This task is running hot!</p>
        <Timer shouldRun={ this.state.shouldRun }/>
        <p>Task Name: { this.props.task._name }</p>
        <p>Task Description: { this.props.task._description }</p>
        <p>{ pauseResumeButton }</p>
        <p><button onClick={(e) => this.stopTask(e)}>Stop</button><button>Done</button></p>
      </div>
    );
  }
}

TaskRunningView.propTypes = {
  task: PropTypes.object,
  stopTask: PropTypes.func
}

export default TaskRunningView;
