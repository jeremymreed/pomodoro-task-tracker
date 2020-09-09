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

import electron from 'electron';
import {v4 as uuidv4} from 'uuid';
import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import Database from '../../database';
import MainView from '../../views/main-view';
import EditTaskView from '../../views/edit-task-view';
import EditLabelView from '../../views/edit-label-view';
import EditSettingsView from '../../views/edit-settings-view';
import TaskRunningView from '../../views/task-running-view';
import ViewTaskView from '../../views/view-task-view';
import ViewLabelView from '../../views/view-label-view';
import TaskMapper from '../../mappers/task-mapper';
import LabelMapper from '../../mappers/label-mapper';
import Task from '../../data-models/task';
import Label from '../../data-models/label';

class App extends React.Component {

  constructor(props) {
    super(props);

    const databasePath = (electron.app || electron.remote.app).getPath('userData') + '/pomodoro-task-tracker-data';
    console.log('App constructor: databasePath', databasePath);

    this.db = new Database(databasePath);
    this.db.enableDebug();

    this.handleDataReady = this.handleDataReady.bind(this);
    this.getLabelById = this.getLabelById.bind(this);
    this.setCurrentList = this.setCurrentList.bind(this);
    this.openEditTaskView = this.openEditTaskView.bind(this);
    this.closeEditTaskView = this.closeEditTaskView.bind(this);
    this.openAddTaskView = this.openAddTaskView.bind(this);
    this.openEditSettingsView = this.openEditSettingsView.bind(this);
    this.closeEditSettingsView = this.closeEditSettingsView.bind(this);
    this.openViewTaskView = this.openViewTaskView.bind(this);
    this.closeViewTaskView = this.closeViewTaskView.bind(this);
    this.openViewLabelView = this.openViewLabelView.bind(this);
    this.closeViewLabelView = this.closeViewLabelView.bind(this);
    this.editLabel = this.editLabel.bind(this);
    this.removeLabel = this.removeLabel.bind(this);
    this.openEditLabelView = this.openEditLabelView.bind(this);
    this.closeEditLabelView = this.closeEditLabelView.bind(this);
    this.openAddLabelView = this.openAddLabelView.bind(this);
    this.updateTaskTimeSpentOnTask = this.updateTaskTimeSpentOnTask.bind(this);
    this.taskDone = this.taskDone.bind(this);
    this.taskDoneById = this.taskDoneById.bind(this);
    this.editTask = this.editTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.setFilter = this.setFilter.bind(this);
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
    this.ViewLabelState = 6;
    this.AddNewLabelState = 7;
    this.EditLabelState = 8;

    this.currentFilter = 'all';

    this.taskListState = 0;
    this.labelListState = 1;

    this.state = {
      dataMap: new Map(),             // Use for lookups only.
      data: [],                       // Data for TaskList.  Passed to TaskList via prop.
      labelMap: new Map(),            // Lookups only.
      labels: [],                     // Data for LabelList.  Passed to LabelList via prop.
      currentTask: -1,
      currentLabel: -1,
      stateVar: this.MainViewState,
      currentList: this.taskListState
    }
  }

  // TODO: Magic numbers, yay!  Will be obsolete when we convert code to TypeScript.
  validateState() {
    return this.state.stateVar >= 0 && this.state.stateVar <= 8;
  }

  validateCurrentList() {
    return this.state.currentList >= 0 && this.state.currentList <= 1;
  }

  validateFilter(filterName) {
    return (filterName === 'all' || filterName === 'tasksDone' || filterName === 'tasksNotDone');
  }

  componentDidMount() {
    this._isMounted = true;

    this.loadState().catch((error) => {
      console.log('Caught error: ', error);
    });

    ipcRenderer.on('showEditSettingsView', this.openEditSettingsView);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // This is a call back, and it is called when the main process has gotten the data we need.
  handleDataReady(rawData) {
    let data = [];
    let dataMap = new Map();

    for ( let i = 0 ; i < rawData.length ; i++ ) {
      if (rawData[i].type === 'task') {
        let task = TaskMapper.mapDataToTask(rawData[i]);

        data.push(task);
        dataMap.set(task._id, task);
      }
    }

    if (this._isMounted) {
      this.setState({dataMap: dataMap, data: data});
    }
  }

  async loadState() {
    try {
      await this.loadTasks();
      await this.loadLabels();
    } catch (error) {
      console.log('Caught error while loading state: error: ', error)
    }
  }

  async loadTasks() {
    try {
      const docs = await this.db.filterTasks(this.currentFilter);
      this.handleDataReady(docs);
    } catch (error) {
      console.log('Caught error while loading data: ', error);
    }
  }

  async loadLabels() {
    try {
      const rawLabels = await this.db.getLabels();
      this.processRawLabels(rawLabels);
    } catch (error) {
      console.log('Caught error: ', error);
    }
  }

  processRawLabels(rawLabels) {
    let labels = [];
    let labelMap = new Map();

    for (let i = 0 ; i < rawLabels.length ; i++) {
      let label = LabelMapper.mapDataToLabel(rawLabels[i]);
      labels.push(label);
      labelMap.set(label._id, label);
    }

    console.log('labels:', labels);
    console.log('labelMap: ', labelMap);

    this.setState({labels: labels, labelMap: labelMap});
  }

  getCurrentTask() {
    if (this.state.currentTask === -1) {
      return new Task(uuidv4(), '', '');
    } else {
      return this.state.dataMap.get(this.state.currentTask);
    }
  }

  getCurrentLabel() {
    if (this.state.currentLabel === -1) {
      return new Label(uuidv4());
    } else {
      return this.state.labelMap.get(this.state.currentLabel);
    }
  }

  getLabelById(labelId) {
    return this.state.labelMap.get(labelId);
  }

  setCurrentList(newValue) {
    if (this.validateCurrentList()) {
      this.setState({currentList: newValue});
    } else {
      throw new Error('invalid current list detected!');
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

  openViewLabelView(labelId) {
    if (this.validateState()) {
      this.setState({currentLabel: labelId, stateVar: this.ViewLabelState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  closeViewLabelView() {
    if (this.validateState()) {
      this.setState({currentLabel: -1, stateVar: this.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  startTask(taskId) {
    if (this.validateState()) {
      this.setState({currentTask: taskId, stateVar: this.TaskRunningState});
      ipcRenderer.send('setLuxaforWork');
    } else {
      throw new Error('invalid state detected!');
    }
  }

  updateTaskTimeSpentOnTask(timeSpentOnTask) {
    if (this.validateState()) {
      let task = this.getCurrentTask();
      task.timeSpent = task.timeSpent + timeSpentOnTask;
      this.db.upsert(task).then((rev) => {
        task._rev = rev;
        ipcRenderer.send('showNotification', 'taskUpdated');
        this.loadState().catch((error) => {
          console.log('Caught error: ', error);
        });
      }).catch((error) => {
        console.log('error: ', error);
      });
    } else {
      throw new Error('invalid state detected!');
    }
  }

  // TODO: There is some duplicated code in these two methods, consider extracting the common code.

  // Called by TaskRunningView: Assumes that there is a current task.
  taskDone() {
    if (this.validateState()) {
      ipcRenderer.send('setLuxaforOff');
      let task = this.getCurrentTask();
      task.done = true;
      this.db.upsert(task).then((rev) => {
        task._rev = rev;
        ipcRenderer.send('showNotification', 'taskDone');
        this.loadState().catch((error) => {
          console.log('Caught error: ', error);
        });
      }).catch((error) => {
        console.log('error: ', error);
      })
    } else {
      throw new Error('invalid state detected!');
    }
  }

  // Called by EditTaskView: Must get task from dataMap, as there is no current task.
  taskDoneById(taskId) {
    if (this.validateState()) {
      ipcRenderer.send('setLuxaforOff');
      if (this.state.dataMap.has(taskId)) {
        let task = this.state.dataMap.get(taskId);
        task.done = true;
        this.db.upsert(task).then((rev) => {
          task._rev = rev;
          ipcRenderer.send('showNotification', 'taskDone');
          this.loadState().catch((error) => {
            console.log('Caught error: ', error);
          });
        }).catch((error) => {
          console.log('error: ', error);
        });
      }
    } else {
      throw new Error('invalid state detected!');
    }
  }

  editTask(name, description, label, done) {
    if (this.validateState()) {
      let task = this.getCurrentTask();
      task.name = name;
      task.description = description;
      task.label = label;
      task.done = done;
      this.db.upsert(task).then((rev) => {
        task._rev = rev;
        ipcRenderer.send('showNotification', 'taskUpdated');
        this.loadState().catch((error) => {
          console.log('Caught error: ', error);
        });
      }).catch((error) => {
        console.log('error: ', error);
      })
    } else {
      throw new Error('invalid state detected!');
    }
  }

  editLabel(name, description, labelLabel) {
    if (this.validateState()) {
      let label = this.getCurrentLabel();
      label.name = name;
      label.description = description;
      label.label = labelLabel;
      this.db.upsert(label).then((rev) => {
        label._rev = rev;
        ipcRenderer.send('showNotification', 'labelUpdated');
        this.loadState().catch((error) => {
          console.log('Caught error: ', error);
        });
      })
    } else {
      throw new Error('invalid state detected');
    }
  }

  removeLabel(labelId) {
    let label = this.state.labelMap.get(labelId);

    // First let's make sure that any task / label with this label, has its label set to an empty string.

    this.db.getByLabel(labelId).then((results) => {
      for ( let i = 0 ; i < results.length ; i++) {
        results[i].label = '';
      }

      this.db.bulkUpsert(results).then((responses) => {
        // We throw exception at any error from bulkUpsert for debug purposes.
        responses.map((response) => {
          if (!response.ok) {
            throw new Error('Failed to verify bulkUpsert');
          }
        });

        // Load state here, to prevent the case where a label is it's own label.
        // In this case, we update the label by setting it's label to empty string, and upsert it.
        // Then the remove() call fails due to a document conflict.
        this.loadState().then(() => {
          label = this.state.labelMap.get(labelId);
          this.db.remove(label).then((result) => {
            if (result.ok) {
              this.loadState().catch((error) => {
                console.log('Caught error: ', error);
              });
            }
          });
        });
      });
    }).catch((error) => {
      console.log('Could not remove the label! error: ', error);
    });
  }

  openEditLabelView(labelId) {
    if (this.validateState()) {
      this.setState({currentLabel: labelId, stateVar: this.EditLabelState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  closeEditLabelView() {
    if (this.validateState()) {
      this.setState({currentLabel: -1, stateVar: this.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  openAddLabelView() {
    if (this.validateState()) {
      this.setState({currentLabel: -1, stateVar: this.AddNewLabelState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  removeTask(taskId) {
    let task = this.state.dataMap.get(taskId);

    this.db.remove(task).then((result) => {
      if (result.ok) {
        this.loadState().catch((error) => {
          console.log('Caught error: ', error);
        });
      }
    }).catch((error) => {
      console.log('Could not remove the task! error: ', error);
    })
  }

  stopTask() {
    if (this.validateState()) {
      this.setState({currentTask: -1, stateVar: this.MainViewState});
      ipcRenderer.send('setLuxaforOff');
    } else {
      throw new Error('invalid state detected!');
    }
  }

  setFilter(filterName) {
    if (this.validateFilter(filterName)) {
      this.currentFilter = filterName;

      this.loadState().then(() => {
      }).catch((error) => {
        console.log('Caught error: ', error);
      })
    } else {
      throw new Error('invalid filter detected!');
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
          <EditTaskView
            newTask={ false }
            title="Task Editor"
            task={ this.getCurrentTask() }
            labels={ this.state.labels }
            editTask={ this.editTask }
            closeEditTaskView={ this.closeEditTaskView }
          />
        </div>
      );
    } else if (this.state.stateVar === this.AddNewTaskState) {
      return (
        <div>
          <EditTaskView
            newTask={ true }
            title="Add New Task"
            task={ this.getCurrentTask() }
            labels={ this.state.labels }
            editTask={ this.editTask }
            closeEditTaskView={ this.closeEditTaskView }
          />
        </div>
      );
    } else if (this.state.stateVar === this.MainViewState) {
      return (
        <div>
          <MainView
            data={ this.state.data }
            labels={ this.state.labels }
            currentList={ this.state.currentList }
            startTask={ this.startTask }
            taskDoneById={ this.taskDoneById }
            setCurrentList={ this.setCurrentList }
            openEditTaskView={ this.openEditTaskView }
            openAddTaskView={this.openAddTaskView}
            openViewTaskView={ this.openViewTaskView }
            openEditSettingsView={ this.openEditSettingsView }
            openViewLabelView={ this.openViewLabelView }
            openEditLabelView={ this.openEditLabelView }
            openAddLabelView={ this.openAddLabelView }
            removeTask={ this.removeTask }
            removeLabel={ this.removeLabel }
            setFilter={ this.setFilter }
          />
        </div>
      );
    } else if (this.state.stateVar === this.ViewTaskState) {
      return (
        <ViewTaskView
          task={ this.getCurrentTask() }
          getLabelById={ this.getLabelById }
          closeViewTaskView={this.closeViewTaskView}
        />
      );
    } else if (this.state.stateVar === this.ViewLabelState) {
      return (
        <ViewLabelView
          label={this.getCurrentLabel() }
          getLabelById={ this.getLabelById }
          closeViewLabelView={this.closeViewLabelView}
        />
      );
    } else if (this.state.stateVar === this.EditLabelState) {
      return (
        <EditLabelView
          title="Edit Label"
          label={ this.getCurrentLabel() }
          labels={ this.state.labels }
          editLabel={ this.editLabel }
          closeEditLabelView={ this.closeEditLabelView }
        />
      );
    } else if (this.state.stateVar === this.AddNewLabelState) {
      return (
        <EditLabelView
          title="Add New Label"
          label={ this.getCurrentLabel() }
          labels={ this.state.labels }
          editLabel={ this.editLabel }
          closeEditLabelView={ this.closeEditLabelView }
        />
      );
    }
  }
}

App.propTypes = {
  changeTheme: PropTypes.func
}

export default App;
