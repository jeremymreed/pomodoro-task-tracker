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

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.startTask = this.startTask.bind(this);
    this.editTask = this.editTask.bind(this);
  }

  startTask(event, taskId, done) {
    event.preventDefault();

    if (!done) {
      this.props.startTask(taskId);
    } else {
      ipcRenderer.send('showNotification', 'disallow-start-task-when-done')
    }
  }

  addTask(event) {
    event.preventDefault();

    this.props.openEditTaskView(-1);
  }

  editTask(event, taskId) {
    event.preventDefault();

    this.props.openEditTaskView(taskId)
  }

  taskDoneById(event, taskId) {
    event.preventDefault();

    this.props.taskDoneById(taskId);
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

  getDone(done) {
    if (done) {
      return '✓';
    } else {
      return '';
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
          <td>{ this.getDone(task.done) }</td>
          <td><button onClick={(e) => this.startTask(e, task.id, task.done)}>Start</button></td>
          <td><button onClick={(e) => this.taskDoneById(e, task.id)}>Done</button></td>
          <td><button onClick={(e) => this.editTask(e, task.id)}>Edit</button></td>
          <td><button className="remove-button" onClick={(e) => this.removeTask(e, task.id)}>Remove</button></td>
        </tr>
      );
    });

    return (
      <table className="task-list-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Time</th>
            <th>Done</th>
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
        { this.getTaskList() }
        <p><button onClick={(e) => this.addTask(e)}>Add new task</button></p>
      </div>
    );
  }
}

TaskList.propTypes = {
  data: PropTypes.array,
  openEditTaskView: PropTypes.func,
  startTask: PropTypes.func,
  taskDoneById: PropTypes.func
};

export default TaskList;
