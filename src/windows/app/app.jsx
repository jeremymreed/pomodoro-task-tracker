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
import TaskRunningView from '../../views/task-running-view';
import Task from '../../data-models/task';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.handleDataReady = this.handleDataReady.bind(this);
    this.openEditTaskView = this.openEditTaskView.bind(this);
    this.closeEditTaskView = this.closeEditTaskView.bind(this);
    this.toggleTaskRunning = this.toggleTaskRunning.bind(this);

    // Place all App state variables here.
    this.state = {
      dataMap: new Map(),
      data: [],
      currentTask: -1,
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
    // showEditTask and taskRunning cannot both be true.
    return !(this.showEditTask && this.taskRunning);
  }

  openEditTaskView(taskId) {
    if (this.validateState()) {
      this.setState({currentTask: taskId, showEditTask: true});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  closeEditTaskView() {
    if (this.validateState()) {
      this.setState({currentTask: -1, showEditTask: false});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  toggleTaskRunning() {
    if (this.validateState()) {
      if (this.state.taskRunning) {
        this.setState({taskRunning: false});
      } else {
        this.setState({taskRunning: true});
      }
    } else {
      throw new Error('invalid state detected!');
    }
  }

  render() {
    if (this.state.taskRunning && !this.state.showEditTask) {
      return (
        <div>
          <TaskRunningView toggleTaskRunning={ this.toggleTaskRunning }/>
        </div>
      );
    } else if (!this.state.taskRunning && this.state.showEditTask) {
      return (
          <div>
          <EditTaskView task={ this.getCurrentTask() } closeEditTaskView={ this.closeEditTaskView }/>
        </div>
      );
    } else if (!this.state.taskRunning && !this.state.showEditTask) {
      return (
        <div>
          <MainView data={ this.state.data } toggleTaskRunning={ this.toggleTaskRunning } openEditTaskView={ this.openEditTaskView }/>
        </div>
      );
    }
  }
}

export default App;
