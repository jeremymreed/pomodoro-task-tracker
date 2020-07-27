import React from 'react';
import PropTypes from 'prop-types';

class TaskRunningView extends React.Component {
  constructor(props) {
    super(props);
  }

  stopTask(event) {
    event.preventDefault();

    this.props.stopTask();
  }

  render() {
    return (
      <div>
        <p>This task is running hot!</p>
        <p>Task Name: { this.props.task._name }</p>
        <p>Task Description: { this.props.task._description }</p>
        <p><button onClick={(e) => this.stopTask(e)}>Stop Task</button></p>
      </div>
    );
  }
}

TaskRunningView.propTypes = {
  task: PropTypes.object,
  stopTask: PropTypes.func
}

export default TaskRunningView;
