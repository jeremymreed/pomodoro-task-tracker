import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.startTask = this.startTask.bind(this);
    this.editTask = this.editTask.bind(this);
  }

  startTask(event, taskId) {
    event.preventDefault();

    this.props.startTask(taskId);
  }

  addTask(event) {
    event.preventDefault();

    this.props.openEditTaskView(-1);
  }

  editTask(event, taskId) {
    event.preventDefault();

    this.props.openEditTaskView(taskId)
  }

  removeTask(event, taskId) {
    event.preventDefault();

    ipcRenderer.send('removeTask', taskId);
  }

  // NOTE: If we ever want to target the browser, we may want to look at Math.trunc again, since IE has no support for it.
  getMinutes(timeInSeconds) {
    const minutes = Math.trunc(timeInSeconds / 60);
    if (minutes < 10 ) {
      return `0${minutes}`;
    } else {
      return `${minutes}`;
    }
  }

  // NOTE: If we ever want to target the browser, we may want to look at Math.trunc again, since IE has no support for it.
  getSeconds(timeInSeconds) {
    const seconds = Math.trunc(timeInSeconds % 60);
    if (seconds < 10 ) {
      return `0${seconds}`;
    } else {
      return `${seconds}`;
    }
  }

  getTimeString(timeInSeconds) {
    return `${this.getMinutes(timeInSeconds)} : ${this.getSeconds(timeInSeconds)}`;
  }

  getTaskList() {
    const listTasks = this.props.data.map((task) => {
      return (
        <tr key={ task.id }>
          <td>{ task.id }</td>
          <td>{ task.name }</td>
          <td>{ task.description }</td>
          <td>{ this.getTimeString(task.timeSpent) }</td>
          <td><button onClick={(e) => this.startTask(e, task.id)}>Start</button></td>
          <td><button onClick={(e) => this.editTask(e, task.id)}>Edit</button></td>
          <td><button onClick={(e) => this.removeTask(e, task.id)}>Remove</button></td>
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
            <th>Time</th>
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
        <p><button onClick={(e) => this.addTask(e)}>Add new task</button></p>
      </div>
    );
  }
}

TaskList.propTypes = {
  data: PropTypes.array,
  openEditTaskView: PropTypes.func,
  startTask: PropTypes.func
};

export default TaskList;
