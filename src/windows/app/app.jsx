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
import { ipcRenderer } from 'electron';
import MainView from '../../views/main-view';
import EditTaskView from '../../views/edit-task-view';
import EditSettingsView from '../../views/edit-settings-view';
import TaskRunningView from '../../views/task-running-view';
import Task from '../../data-models/task';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.handleDataReady = this.handleDataReady.bind(this);
    this.openEditTaskView = this.openEditTaskView.bind(this);
    this.closeEditTaskView = this.closeEditTaskView.bind(this);
    this.openEditSettingsView = this.openEditSettingsView.bind(this);
    this.closeEditSettingsView = this.closeEditSettingsView.bind(this);
    this.updateTask = this.updateTask.bind(this);
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
    this.TaskRunningState = 2;
    this.EditSettingsState = 3;

    this.state = {
      dataMap: new Map(),
      data: [],
      currentTask: -1,
      stateVar: this.MainViewState,
      showEditTask: false,  // Show EditTaskDialog.
      taskRunning: false    // Show TaskRunningView.
    }
  }

  componentDidMount() {
    this._isMounted = true;
    ipcRenderer.on('dataReady', this.handleDataReady);
    ipcRenderer.send('getData');
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

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

  validateState() {
    return this.state.stateVar >= 0 && this.state.stateVar <= 3;
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

  startTask(taskId) {
    if (this.validateState()) {
      this.setState({currentTask: taskId, stateVar: this.TaskRunningState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  updateTask(timeSpentOnTask, done) {
    console.log('App: updateTask: timeSpentOnTask:', timeSpentOnTask);
    if (this.validateState()) {
      let task = this.getCurrentTask();
      task.timeSpent = task.timeSpent + timeSpentOnTask;
      task.done = done;
      ipcRenderer.send('submitTaskData', task);
    } else {
      throw new Error('invalid state detected!');
    }
  }

  stopTask() {
    if (this.validateState()) {
      ipcRenderer.send('showNotification', {
        title: 'Stopped Task',
        body: 'The task has been stopped',
        urgency: 'critical'
      });

      this.setState({currentTask: -1, stateVar: this.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  render() {
    if (this.state.stateVar === this.TaskRunningState) {
      return (
        <div>
          <TaskRunningView task={ this.getCurrentTask() } updateTask={ this.updateTask } stopTask={ this.stopTask }/>
        </div>
      );
    } else if (this.state.stateVar === this.EditSettingsState) {
      return (
          <div>
          <EditSettingsView closeEditSettingsView={ this.closeEditSettingsView }/>
        </div>
      );
    } else if (this.state.stateVar === this.EditTaskState) {
      return (
          <div>
          <EditTaskView task={ this.getCurrentTask() } closeEditTaskView={ this.closeEditTaskView }/>
        </div>
      );
    } else if (this.state.stateVar === this.MainViewState) {
      return (
        <div>
          <MainView data={ this.state.data } startTask={ this.startTask } openEditTaskView={ this.openEditTaskView } openEditSettingsView={ this.openEditSettingsView }/>
        </div>
      );
    }
  }
}

export default App;
