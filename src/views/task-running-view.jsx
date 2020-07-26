import React from 'react';
import PropTypes from 'prop-types';

class TaskRunningView extends React.Component {
  constructor(props) {
    super(props);
  }

  stopTask(event) {
    event.preventDefault();

    this.props.toggleTaskRunning();
  }

  render() {
    return (
      <div>
        <h1>This task is running hot!</h1>
        <p><button onClick={(e) => this.stopTask(e)}>Stop Task</button></p>
      </div>
    );
  }
}

TaskRunningView.propTypes = {
  toggleTaskRunning: PropTypes.func
}

export default TaskRunningView;
