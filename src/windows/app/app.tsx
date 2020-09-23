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
import CurrentListState from '../../enums/current-list-state-enum';

interface AppProps {
  changeTheme: (themeName: string) => void
}

interface AppState {
  taskMap: Map<string, Task>
  tasks: Array<Task>
  labelMap: Map<string, Label>
  labels: Array<Label>
  currentTask: string
  currentLabel: string
  stateVar: StateVars
  currentList: CurrentListState
}

enum StateVars {
  MainViewState,
  EditTaskState,
  AddNewTaskState,
  TaskRunningState,
  EditSettingsState,
  ViewTaskState,
  ViewLabelState,
  AddNewLabelState,
  EditLabelState,
}

class App extends React.Component<AppProps, AppState> {

  _isMounted: boolean
  db: Database | undefined

  currentFilter: string

  constructor(props: AppProps) {
    super(props);

    this.db = undefined;

    this._isMounted = false;

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

    this.currentFilter = 'all';

    this.state = {
      taskMap: new Map(),             // Use for lookups only.
      tasks: [],                       // Data for TaskList.  Passed to TaskList via prop.
      labelMap: new Map(),            // Lookups only.
      labels: [],                     // Data for LabelList.  Passed to LabelList via prop.
      currentTask: '',
      currentLabel: '',
      stateVar: StateVars.MainViewState,
      currentList: CurrentListState.taskListState
    }
  }

  // Database can be undefined, until it is set componentDidMount.
  // This function will handle the case of undefined database.
  validateDatabase() {
    if (this.db == undefined) {
      throw new Error('this.db is undefined!');
    }
  }

  // TODO: Magic numbers, yay!  Will be obsolete when we convert code to TypeScript.
  validateState() {
    return true;
  }

  validateCurrentList() {
    return this.state.currentList >= 0 && this.state.currentList <= 1;
  }

  validateFilter(filterName: string) {
    return (filterName === 'all' || filterName === 'tasksDone' || filterName === 'tasksNotDone');
  }

  componentDidMount() {
    this._isMounted = true;

    ipcRenderer.on('showEditSettingsView', this.openEditSettingsView);

    ipcRenderer.send('getDatabaseName');

    ipcRenderer.on('databaseName', (event, databaseName) => {
      const databasePath = (electron.app || electron.remote.app).getPath('userData') + '/' + databaseName;

      console.log('componentDidMount: databaseFullPath', databasePath);

      this.db = new Database(databasePath);
      this.db.disableDebug();

      this.loadState().catch((error) => {
        console.log('Caught error: ', error);
      });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // This is a call back, and it is called when the main process has gotten the data we need.
  handleDataReady(rawData: Array<any>) {
    let tasks = [];
    let taskMap = new Map();

    for ( let i = 0 ; i < rawData.length ; i++ ) {
      if (rawData[i].type === 'task') {
        let task = TaskMapper.mapDataToTask(rawData[i]);

        tasks.push(task);
        taskMap.set(task._id, task);
      }
    }

    if (this._isMounted) {
      this.setState({taskMap: taskMap, tasks: tasks});
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
    if (this.db == undefined) {
      throw new Error('this.db is undefined!');
    }

    try {
      const docs: any = await this.db.filterTasks(this.currentFilter);
      this.handleDataReady(docs);
    } catch (error) {
      console.log('Caught error while loading data: ', error);
    }
  }

  async loadLabels() {
    if (this.db == undefined) {
      throw new Error('this.db is undefined!');
    }

    try {
      const rawLabels: any = await this.db.getLabels();
      this.processRawLabels(rawLabels);
    } catch (error) {
      console.log('Caught error: ', error);
    }
  }

  processRawLabels(rawLabels: Array<any>) {
    let labels = [];
    let labelMap = new Map();

    for (let i = 0 ; i < rawLabels.length ; i++) {
      let label = LabelMapper.mapDataToLabel(rawLabels[i]);
      labels.push(label);
      labelMap.set(label._id, label);
    }

    this.setState({labels: labels, labelMap: labelMap});
  }

  getCurrentTask(): Task {
    if (this.state.currentTask === '') {
      return new Task(uuidv4(), '', '');
    } else {
      let task = this.state.taskMap.get(this.state.currentTask);
      if (task != undefined) {
        return task;
      } else {
        throw new Error('getCurrentTask: task was undefined!');
      }
    }
  }

  getCurrentLabel(): Label {
    if (this.state.currentLabel === '') {
      return new Label(uuidv4());
    } else {
      let label = this.state.labelMap.get(this.state.currentLabel);
      if (label != undefined) {
        return label;
      } else {
        throw new Error('getCurrentLabel: label was undefined');
      }
    }
  }

  getTaskById(taskId: string): Task {
    let task = this.state.taskMap.get(taskId);

    if (task != undefined) {
      return task;
    } else {
      throw new Error('getTaskById: task is undefined!');
    }
  }

  getLabelById(labelId: string) {
    return this.state.labelMap.get(labelId);
  }

  setCurrentList(newValue: number) {
    if (this.validateCurrentList()) {
      this.setState({currentList: newValue});
    } else {
      throw new Error('invalid current list detected!');
    }
  }

  openEditTaskView(taskId: string) {
    if (this.validateState()) {
      this.setState({currentTask: taskId, stateVar: StateVars.EditTaskState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  closeEditTaskView() {
    if (this.validateState()) {
      this.setState({currentTask: '', stateVar: StateVars.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  openAddTaskView() {
    if (this.validateState()) {
      this.setState({currentTask: '', stateVar: StateVars.AddNewTaskState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  openEditSettingsView() {
    if (this.validateState()) {
      this.setState({stateVar: StateVars.EditSettingsState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  closeEditSettingsView() {
    if (this.validateState()) {
      this.setState({currentTask: '', stateVar: StateVars.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  openViewTaskView(taskId: string) {
    if (this.validateState()) {
      this.setState({currentTask: taskId, stateVar: StateVars.ViewTaskState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  closeViewTaskView() {
    if (this.validateState()) {
      this.setState({currentTask: '', stateVar: StateVars.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  openViewLabelView(labelId: string) {
    if (this.validateState()) {
      this.setState({currentLabel: labelId, stateVar: StateVars.ViewLabelState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  closeViewLabelView() {
    if (this.validateState()) {
      this.setState({currentLabel: '', stateVar: StateVars.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  startTask(taskId: string) {
    if (this.validateState()) {
      this.setState({currentTask: taskId, stateVar: StateVars.TaskRunningState});
      ipcRenderer.send('setLuxaforWork');
    } else {
      throw new Error('invalid state detected!');
    }
  }

  updateTaskTimeSpentOnTask(timeSpentOnTask: number) {
    if (this.db == undefined) {
      throw new Error('this.db is undefined!');
    }

    if (this.validateState()) {
      let task: Task = this.getCurrentTask();
      task.timeSpent = task.timeSpent + timeSpentOnTask;
      this.db.upsert(task).then((rev) => {
        if (rev == undefined) {
          throw new Error('updateTaskTimeSpentOnTask: rev is undefined!');
        }

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
    if (this.db == undefined) {
      throw new Error('this.db is undefined!');
    }

    if (this.validateState()) {
      ipcRenderer.send('setLuxaforOff');
      let task = this.getCurrentTask();
      task.done = true;
      this.db.upsert(task).then((rev) => {
        if (rev == undefined) {
          throw new Error('taskDone: rev is undefined!');
        }

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
  taskDoneById(taskId: string) {
    if (this.db == undefined) {
      throw new Error('this.db is undefined!');
    }

    if (this.validateState()) {
      ipcRenderer.send('setLuxaforOff');
      if (this.state.taskMap.has(taskId)) {
        let task = this.getTaskById(taskId);
        task.done = true;
        this.db.upsert(task).then((rev) => {
          if (rev == undefined) {
            throw new Error('taskDoneById: rev is undefined!');
          }

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

  editTask(name: string, description: string, label: string, done: boolean) {
    if (this.db == undefined) {
      throw new Error('this.db is undefined!');
    }

    if (this.validateState()) {
      let task = this.getCurrentTask();
      task.name = name;
      task.description = description;
      task.labelId = label;
      task.done = done;
      this.db.upsert(task).then((rev) => {
        if (rev == undefined) {
          throw new Error('editTask: rev is undefined!');
        }

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

  editLabel(name: string, description: string, labelLabelId: string) {
    console.log(`name: ${name}, description: ${description}, labelLabelId: ${labelLabelId}`);

    if (this.db == undefined) {
      throw new Error('this.db is undefined!');
    }

    if (this.validateState()) {
      let label = this.getCurrentLabel();

      if (label.labelId === labelLabelId) {
        throw new Error('Cannot assign label to itself.');
      }

      label.name = name;
      label.description = description;
      label.labelId = labelLabelId;
      this.db.upsert(label).then((rev) => {
        if (rev == undefined) {
          throw new Error('editLabel: rev is undefined!');
        }

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

  removeLabel(labelId: string) {
    if (this.db == undefined) {
      throw new Error('this.db is undefined!');
    }

    let label = this.state.labelMap.get(labelId);

    // First let's make sure that any task / label with this label, has its label set to an empty string.

    this.db.getByLabel(labelId).then((results: any) => {
      if (this.db == undefined) {
        throw new Error('this.db is undefined!');
      }

      if (results == undefined) {
        throw new Error('removeLabel: results is undefined!');
      }

      for ( let i = 0 ; i < results.length ; i++) {
        results[i].label = '';
      }

      this.db.bulkUpsert(results).then((responses) => {
        if (responses == undefined) {
          throw new Error('removeLabel: responses is undefined!');
        }
        // We throw exception at any error from bulkUpsert for debug purposes.
        responses.map((response: any) => {
          if (!response.ok) {
            throw new Error('Failed to verify bulkUpsert');
          }
        });

        // Load state here, to prevent the case where a label is it's own label.
        // In this case, we update the label by setting it's label to empty string, and upsert it.
        // Then the remove() call fails due to a document conflict.
        this.loadState().then(() => {
          if (this.db == undefined) {
            throw new Error('this.db is undefined!');
          }

          label = this.state.labelMap.get(labelId);
          this.db.remove(label).then((result) => {
            if (result == undefined) {
              throw new Error('removeLabel: result is undefined!');
            }
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

  openEditLabelView(labelId: string) {
    if (this.validateState()) {
      this.setState({currentLabel: labelId, stateVar: StateVars.EditLabelState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  closeEditLabelView() {
    if (this.validateState()) {
      this.setState({currentLabel: '', stateVar: StateVars.MainViewState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  openAddLabelView() {
    if (this.validateState()) {
      this.setState({currentLabel: '', stateVar: StateVars.AddNewLabelState});
    } else {
      throw new Error('invalid state detected!');
    }
  }

  removeTask(taskId: string) {
    if (this.db == undefined) {
      throw new Error('this.db is undefined!');
    }

    let task = this.state.taskMap.get(taskId);

    this.db.remove(task).then((result) => {
      if (result == undefined) {
        throw new Error('removeTask: result is undefined');
      }
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
      this.setState({currentTask: '', stateVar: StateVars.MainViewState});
      ipcRenderer.send('setLuxaforOff');
    } else {
      throw new Error('invalid state detected!');
    }
  }

  setFilter(filterName: string) {
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
    if (this.state.stateVar === StateVars.TaskRunningState) {
      return (
        <div>
          <TaskRunningView task={ this.getCurrentTask() } updateTaskTimeSpentOnTask={ this.updateTaskTimeSpentOnTask } taskDone={ this.taskDone } stopTask={ this.stopTask }/>
        </div>
      );
    } else if (this.state.stateVar === StateVars.EditSettingsState) {
      return (
          <div>
          <EditSettingsView closeEditSettingsView={ this.closeEditSettingsView } changeTheme={this.props.changeTheme} />
        </div>
      );
    } else if (this.state.stateVar === StateVars.EditTaskState) {
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
    } else if (this.state.stateVar === StateVars.AddNewTaskState) {
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
    } else if (this.state.stateVar === StateVars.MainViewState) {
      return (
        <div>
          <MainView
            tasks={ this.state.tasks }
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
    } else if (this.state.stateVar === StateVars.ViewTaskState) {
      return (
        <ViewTaskView
          task={ this.getCurrentTask() }
          getLabelById={ this.getLabelById }
          closeViewTaskView={this.closeViewTaskView}
        />
      );
    } else if (this.state.stateVar === StateVars.ViewLabelState) {
      return (
        <ViewLabelView
          label={this.getCurrentLabel() }
          getLabelById={ this.getLabelById }
          closeViewLabelView={this.closeViewLabelView}
        />
      );
    } else if (this.state.stateVar === StateVars.EditLabelState) {
      return (
        <EditLabelView
          title="Edit Label"
          label={ this.getCurrentLabel() }
          labels={ this.state.labels }
          editLabel={ this.editLabel }
          closeEditLabelView={ this.closeEditLabelView }
        />
      );
    } else if (this.state.stateVar === StateVars.AddNewLabelState) {
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

export default App;
