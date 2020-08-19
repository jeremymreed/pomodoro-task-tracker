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
import PouchDB from 'pouchdb';
import MainView from '../../views/main-view';
import EditTaskView from '../../views/edit-task-view';
import EditSettingsView from '../../views/edit-settings-view';
import TaskRunningView from '../../views/task-running-view';
import ViewTaskView from '../../views/view-task-view';
import Task from '../../data-models/task';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.db = new PouchDB('pomodoro-task-tracker');

    this.handleDataReady = this.handleDataReady.bind(this);
    this.openEditTaskView = this.openEditTaskView.bind(this);
    this.closeEditTaskView = this.closeEditTaskView.bind(this);
    this.openAddTaskView = this.openAddTaskView.bind(this);
    this.openEditSettingsView = this.openEditSettingsView.bind(this);
    this.closeEditSettingsView = this.closeEditSettingsView.bind(this);
    this.openViewTaskView = this.openViewTaskView.bind(this);
    this.closeViewTaskView = this.closeViewTaskView.bind(this);
    this.updateTaskTimeSpentOnTask = this.updateTaskTimeSpentOnTask.bind(this);
    this.taskDone = this.taskDone.bind(this);
    this.taskDoneById = this.taskDoneById.bind(this);
    this.editTask = this.editTask.bind(this);
    this.startTask = this.startTask.bind(this);
    this.stopTask = this.stopTask.bind(this);

    // Place all App state variables here.
    // stateVar:
    //    0: MainView
    //    1: EditTaskView
    //    2: TaskRunningView
    // Putting state var names here, we should use an enum here.
    this.MainViewState = 0;
    this.EditTaskState = 1;
    this.AddNewTaskState = 2
    this.TaskRunningState = 3;
    this.EditSettingsState = 4;
    this.ViewTaskState = 5;

    // TODO: Consider using only dataMap, and generate data array on the fly when needed.
    this.state = {
      dataMap: new Map(),             // Task Data in map, makes lookup easier.
      data: [],                       // Task Data in array, easy to display in TaskList.
      currentTask: -1,
      stateVar: this.MainViewState,
    }
  }

  // TODO: Magic numbers, yay!  Will be obsolete when we convert code to TypeScript.
  validateState() {
    return this.state.stateVar >= 0 && this.state.stateVar <= 5;
  }

  componentDidMount() {
    this._isMounted = true;
    //this.db.put(testDoc);

    this.db.info().then((info) => {console.log(info)});
    this.db.get('Test').then((doc) => {console.log('doc: ', doc)});

    ipcRenderer.on('showEditSettingsView', this.openEditSettingsView);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // This is a call back, and it is called when the main process has gotten the data we need.
  handleDataReady(event, dataMap) {
    let data = [];
    const iter = dataMap.values();

    let item = iter.next();
    while ( !item.done ) {
      data.push(item.value);
      item = iter.next();
    }

    if (this._isMounted) {
      this.setState({dataMap: dataMap, data: data});
    }
  }

  getCurrentTask() {
    if (this.state.currentTask === -1) {
      return new Task(-1, '', '');
    } else {
      return this.state.dataMap.get(this.state.currentTask);
    }
  }

  openEditTaskView(taskId) {
    if (this.validateState()) {
      this.setState({currentTask: taskId, stateVar: this.EditTaskState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  closeEditTaskView() {
    if (this.validateState()) {
      this.setState({currentTask: -1, stateVar: this.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  openAddTaskView() {
    console.log('openAddTaskView called');
    if (this.validateState()) {
      this.setState({currentTask: -1, stateVar: this.AddNewTaskState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  openEditSettingsView() {
    if (this.validateState()) {
      this.setState({stateVar: this.EditSettingsState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  closeEditSettingsView() {
    if (this.validateState()) {
      this.setState({currentTask: -1, stateVar: this.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  openViewTaskView(taskId) {
    if (this.validateState()) {
      this.setState({currentTask: taskId, stateVar: this.ViewTaskState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  closeViewTaskView() {
    if (this.validateState()) {
      this.setState({currentTask: -1, stateVar: this.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  startTask(taskId) {
    if (this.validateState()) {
      this.setState({currentTask: taskId, stateVar: this.TaskRunningState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  updateTaskTimeSpentOnTask(timeSpentOnTask) {
    if (this.validateState()) {
      let task = this.getCurrentTask();
      task.timeSpent = task.timeSpent + timeSpentOnTask;
      ipcRenderer.send('submitTaskData', task);
    } else {
      throw new Error('invalid state detected!');
    }
  }

  // TODO: There is some duplicated code in these two methods, consider extracting the common code.

  // Called by TaskRunningView: Assumes that there is a current task.
  taskDone() {
    if (this.validateState()) {
      let task = this.getCurrentTask();
      task.done = true;
      ipcRenderer.send('submitTaskData', task)
      ipcRenderer.send('showNotification', 'taskDone');
    } else {
      throw new Error('invalid state detected!');
    }
  }

  // Called by EditTaskView: Must get task from dataMap, as there is no current task.
  taskDoneById(taskId) {
    if (this.validateState()) {
      if (this.state.dataMap.has(taskId)) {
        let task = this.state.dataMap.get(taskId);
        task.done = true;
        ipcRenderer.send('submitTaskData', task);
        ipcRenderer.send('showNotification', 'taskDone');
      }
    } else {
      throw new Error('invalid state detected!');
    }
  }

  editTask(name, description, done) {
    if (this.validateState()) {
      let task = this.getCurrentTask();
      task.name = name;
      task.description = description;
      task.done = done;
      ipcRenderer.send('submitTaskData', task);
    } else {
      throw new Error('invalid state detected!');
    }
  }

  stopTask() {
    if (this.validateState()) {
      this.setState({currentTask: -1, stateVar: this.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  render() {
    if (this.state.stateVar === this.TaskRunningState) {
      return (
        <div>
          <TaskRunningView task={ this.getCurrentTask() } updateTaskTimeSpentOnTask={ this.updateTaskTimeSpentOnTask } taskDone={ this.taskDone } stopTask={ this.stopTask }/>
        </div>
      );
    } else if (this.state.stateVar === this.EditSettingsState) {
      return (
          <div>
          <EditSettingsView closeEditSettingsView={ this.closeEditSettingsView } changeTheme={this.props.changeTheme} />
        </div>
      );
    } else if (this.state.stateVar === this.EditTaskState) {
      return (
          <div>
          <EditTaskView title="Task Editor" task={ this.getCurrentTask() } editTask={ this.editTask } closeEditTaskView={ this.closeEditTaskView }/>
        </div>
      );
    } else if (this.state.stateVar === this.AddNewTaskState) {
      return (
          <div>
          <EditTaskView title="Add New Task" task={ this.getCurrentTask() } editTask={ this.editTask } closeEditTaskView={ this.closeEditTaskView }/>
        </div>
      );
    } else if (this.state.stateVar === this.MainViewState) {
      return (
        <div>
          <MainView data={ this.state.data } startTask={ this.startTask } taskDoneById={ this.taskDoneById } openEditTaskView={ this.openEditTaskView } openAddTaskView={this.openAddTaskView} openViewTaskView={ this.openViewTaskView } openEditSettingsView={ this.openEditSettingsView }/>
        </div>
      );
    } else if (this.state.stateVar === this.ViewTaskState) {
      return (
        <ViewTaskView task={ this.getCurrentTask() } closeViewTaskView={this.closeViewTaskView} />
      );
    }
  }
}

App.propTypes = {
  changeTheme: PropTypes.func
}

export default App;
