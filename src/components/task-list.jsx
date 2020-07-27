import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';

class TaskList extends React.Component {
  constructor(props) {
    super(props);
  }

  startTask(event) {
    event.preventDefault();

    this.props.toggleTaskRunning();
  }

  editTask(event, taskId) {
    event.preventDefault();

    this.props.openEditTaskView(taskId)
  }

  removeTask(event, taskId) {
    event.preventDefault();

    ipcRenderer.send('removeTask', taskId);
  }

  getTaskList() {
    const listTasks = this.props.data.map((task) => {
      return (
        <tr key={ task._id }>
          <td>{ task._id }</td>
          <td>{ task._name }</td>
          <td>{ task._description }</td>
          <td><button onClick={(e) => this.startTask(e)}>Start</button></td>
          <td><button onClick={(e) => this.editTask(e, task._id)}>Edit</button></td>
          <td><button onClick={(e) => this.removeTask(e, task._id)}>Remove</button></td>
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          { listTasks }
        </tbody>
      </table>
    );
  }

  render () {
    return (
      <div>
        <p>Testing Main View</p>
        { this.getTaskList() }
        <p><button>Add new task</button></p>
      </div>
    );
  }
}

TaskList.propTypes = {
  data: PropTypes.array,
  openEditTaskView: PropTypes.func,
  toggleTaskRunning: PropTypes.func
};

export default TaskList;
