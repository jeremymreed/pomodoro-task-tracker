import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';

class TaskList extends React.Component {
  constructor(props) {
    super(props);
  }

  openEditTaskDialog(event, taskId) {
    event.preventDefault();

    ipcRenderer.send('openEditTaskDialog', taskId);
  }

  openAddTaskDialog(event) {
    event.preventDefault();

    ipcRenderer.send('openEditTaskDialog', -1);
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
          <td><button>Start</button></td>
          <td><button onClick={(e) => this.openEditTaskDialog(e, task._id)}>Edit</button></td>
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
        <p><button onClick={(event) => this.openAddTaskDialog(event)}>Add new task</button></p>
      </div>
    );
  }
}

TaskList.propTypes = {
  data: PropTypes.array
};

export default TaskList;
