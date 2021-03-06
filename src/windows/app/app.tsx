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

import { ipcRenderer } from "electron";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import EnvPaths from "../../paths";
import Database from "../../database";
import MainView from "../../views/main-view";
import EditTaskView from "../../views/edit-task-view";
import EditLabelView from "../../views/edit-label-view";
import EditSettingsView from "../../views/edit-settings-view";
import TaskRunningView from "../../views/task-running-view";
import ViewTaskView from "../../views/view-task-view";
import ViewLabelView from "../../views/view-label-view";
import TaskMapper from "../../mappers/task-mapper";
import LabelMapper from "../../mappers/label-mapper";
import Task from "../../data-models/task";
import Label from "../../data-models/label";
import StateVars from "../../enums/state-vars-enum";
import CurrentListState from "../../enums/current-list-state-enum";
import TaskFilter from "../../enums/task-filter-enum";
import UpsertResponse from "../../interfaces/upsert-response-interface";
import RawTask from "../../interfaces/raw-task-interface";
import RawLabel from "../../interfaces/raw-label-interface";

interface AppProps {
  changeTheme: (themeName: string) => void;
}

interface AppState {
  taskMap: Map<string, Task>;
  tasks: Array<Task>;
  labelMap: Map<string, Label>;
  labels: Array<Label>;
  currentTask: string;
  currentLabel: string;
  stateVar: StateVars;
  currentList: CurrentListState;
}

class App extends React.Component<AppProps, AppState> {
  private db: Database | undefined;

  private envPaths: EnvPaths | undefined;

  private pouchdbDebug: boolean;

  private currentFilter: TaskFilter;

  constructor(props: AppProps) {
    super(props);

    this.db = undefined;
    this.envPaths = undefined;

    this.processRawTasks = this.processRawTasks.bind(this);
    this.getLabelById = this.getLabelById.bind(this);
    this.setCurrentList = this.setCurrentList.bind(this);
    this.editLabel = this.editLabel.bind(this);
    this.removeLabel = this.removeLabel.bind(this);
    this.updateTaskTimeSpentOnTask = this.updateTaskTimeSpentOnTask.bind(this);
    this.taskDone = this.taskDone.bind(this);
    this.taskDoneById = this.taskDoneById.bind(this);
    this.editTask = this.editTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.startTask = this.startTask.bind(this);
    this.stopTask = this.stopTask.bind(this);
    this.togglePouchdbDebug = this.togglePouchdbDebug.bind(this);
    this.appStateUpdate = this.appStateUpdate.bind(this);

    this.pouchdbDebug = true;
    this.currentFilter = TaskFilter.All;

    this.state = {
      taskMap: new Map(), // Use for lookups only.
      tasks: [], // Data for TaskList.  Passed to TaskList via prop.
      labelMap: new Map(), // Lookups only.
      labels: [], // Data for LabelList.  Passed to LabelList via prop.
      currentTask: "",
      currentLabel: "",
      stateVar: StateVars.MainViewState,
      currentList: CurrentListState.taskListState,
    };
  }

  componentDidMount(): void {
    ipcRenderer.on("showEditSettingsView", () => {
      this.appStateUpdate(StateVars.EditSettingsState, "", "");
    });

    ipcRenderer.on("togglePouchdbDebug", this.togglePouchdbDebug);

    ipcRenderer.send("getDatabaseName");

    ipcRenderer.on("databaseName", (event, databaseName) => {
      this.envPaths = new EnvPaths();

      const databasePathBase = this.envPaths.getConfig();
      const databasePath = `${databasePathBase}/${databaseName}`;

      // eslint-disable-next-line no-console
      console.log("databasePath: ", databasePath);

      // eslint-disable-next-line no-console
      console.log("componentDidMount: databaseFullPath", databasePath);

      this.db = new Database(databasePath);

      if (this.pouchdbDebug) {
        this.db.enableDebug();
      } else {
        this.db.disableDebug();
      }

      this.loadState().catch((error) => {
        // eslint-disable-next-line no-console
        console.log("Caught error: ", error);
      });
    });
  }

  componentWillUnmount(): void {
    if (this.db !== undefined) {
      this.db.close();
    }
  }

  getCurrentTask(): Task {
    const { currentTask, taskMap } = this.state;

    // eslint-disable-next-line no-console
    console.log("currentTask: ", currentTask);

    const task = taskMap.get(currentTask);

    if (task === undefined) {
      throw new Error("getCurrentTask: task was undefined!");
    }

    return task;
  }

  getCurrentLabel(): Label {
    const { currentLabel, labelMap } = this.state;

    const label = labelMap.get(currentLabel);

    if (label === undefined) {
      throw new Error("getCurrentLabel: label was undefined");
    }

    return label;
  }

  getTaskById(taskId: string): Task {
    const { taskMap } = this.state;

    const task = taskMap.get(taskId);

    if (task === undefined) {
      throw new Error("getTaskById: task is undefined!");
    }

    return task;
  }

  getLabelById(labelId: string): Label {
    const { labelMap } = this.state;

    const label = labelMap.get(labelId);

    if (label === undefined) {
      throw new Error("getLabelById: label is undefined!");
    }

    return label;
  }

  setCurrentList(newValue: number): void {
    if (this.validateCurrentList()) {
      this.setState({ currentList: newValue });
    } else {
      throw new Error("invalid current list detected!");
    }
  }

  setFilter(filterName: TaskFilter): void {
    this.currentFilter = filterName;

    this.loadState().catch((error) => {
      // eslint-disable-next-line no-console
      console.log("Caught error: ", error);
    });
  }

  editTask(task: Task): void {
    if (this.db === undefined) {
      throw new Error("this.db is undefined!");
    }

    // eslint-disable-next-line no-console
    console.log("task: ", task);

    const tempTask = task;

    this.db
      .upsert(task)
      .then((rev) => {
        if (rev === undefined) {
          throw new Error("editTask: rev is undefined!");
        }

        tempTask._rev = rev;
        ipcRenderer.send("showNotification", "taskUpdated");
        this.loadState().catch((error) => {
          // eslint-disable-next-line no-console
          console.log("Caught error: ", error);
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("error: ", error);
      });
  }

  editLabel(label: Label): void {
    if (this.db === undefined) {
      throw new Error("this.db is undefined!");
    }

    if (label.labelId === label._id) {
      throw new Error("Cannot assign label to itself.");
    }

    const tempLabel = label;

    this.db.upsert(label).then((rev) => {
      if (rev === undefined) {
        throw new Error("editLabel: rev is undefined!");
      }

      tempLabel._rev = rev;
      ipcRenderer.send("showNotification", "labelUpdated");
      this.loadState().catch((error) => {
        // eslint-disable-next-line no-console
        console.log("Caught error: ", error);
      });
    });
  }

  removeLabel(labelId: string): void {
    const { labelMap } = this.state;

    if (this.db === undefined) {
      throw new Error("this.db is undefined!");
    }

    let label: Label | undefined = labelMap.get(labelId);

    if (label === undefined) {
      throw new Error("removeLabel: label is undefined!");
    }

    // First let's make sure that any task / label with this label, has its label set to an empty string.

    this.db
      .getByLabelId(labelId)
      .then((results: Array<RawTask | RawLabel>) => {
        if (this.db === undefined) {
          throw new Error("this.db is undefined!");
        }

        if (results === undefined) {
          throw new Error("removeLabel: results is undefined!");
        }

        for (let i = 0; i < results.length; i += 1) {
          // results[i].labelId = "";
          const result = results[i];
          result.labelId = "";
        }

        this.db.bulkUpsert(results).then((responses: Array<UpsertResponse>) => {
          if (responses === undefined) {
            throw new Error("removeLabel: responses is undefined!");
          }

          // We throw exception at any error from bulkUpsert for debug purposes.
          for (let i = 0; i < responses.length; i += 1) {
            if (responses[i].ok === undefined) {
              throw new Error("Failed to verify bulkUpsert");
            }
          }

          // Load state here, to prevent the case where a label is it's own label.
          // In this case, we update the label by setting it's label to empty string, and upsert it.
          // Then the remove() call fails due to a document conflict.
          this.loadState().then(() => {
            if (this.db === undefined) {
              throw new Error("this.db is undefined!");
            }

            label = labelMap.get(labelId);
            this.db.remove(label).then((result) => {
              if (result === undefined) {
                throw new Error("removeLabel: result is undefined!");
              }
              if (result.ok) {
                this.loadState().catch((error) => {
                  // eslint-disable-next-line no-console
                  console.log("Caught error: ", error);
                });
              }
            });
          });
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("Could not remove the label! error: ", error);
      });
  }

  removeTask(taskId: string): void {
    const { taskMap } = this.state;

    if (this.db === undefined) {
      throw new Error("this.db is undefined!");
    }

    const task = taskMap.get(taskId);

    if (task === undefined) {
      throw new Error("removeTask: task is undefined!");
    }

    this.db
      .remove(task)
      .then((result) => {
        if (result === undefined) {
          throw new Error("removeTask: result is undefined");
        }
        if (result.ok) {
          this.loadState().catch((error) => {
            // eslint-disable-next-line no-console
            console.log("Caught error: ", error);
          });
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("Could not remove the task! error: ", error);
      });
  }

  stopTask(): void {
    this.setState({ currentTask: "", stateVar: StateVars.MainViewState });
    ipcRenderer.send("setLuxaforOff");
  }

  processRawLabels(rawLabels: Array<RawLabel>): void {
    const labels: Array<Label> = [];
    const labelMap: Map<string, Label> = new Map();

    for (let i = 0; i < rawLabels.length; i += 1) {
      const label = LabelMapper.mapDataToLabel(rawLabels[i]);
      labels.push(label);
      labelMap.set(label._id, label);
    }

    this.setState({ labels, labelMap });
  }

  async loadLabels(): Promise<void> {
    if (this.db === undefined) {
      throw new Error("this.db is undefined!");
    }

    try {
      const rawLabels: Array<RawLabel> = await this.db.getLabels();
      this.processRawLabels(rawLabels);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Caught error: ", error);
    }
  }

  async loadTasks(): Promise<void> {
    if (this.db === undefined) {
      throw new Error("this.db is undefined!");
    }

    try {
      const rawTasks: Array<RawTask> = await this.db.filterTasks(
        this.currentFilter
      );
      this.processRawTasks(rawTasks);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Caught error while loading data: ", error);
    }
  }

  async loadState(): Promise<void> {
    try {
      await this.loadTasks();
      await this.loadLabels();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Caught error while loading state: error: ", error);
    }
  }

  // This is a call back, and it is called when the main process has gotten the data we need.
  processRawTasks(rawTasks: Array<RawTask>): void {
    const tasks = [];
    const taskMap = new Map();

    for (let i = 0; i < rawTasks.length; i += 1) {
      if (rawTasks[i].type === "task") {
        const task = TaskMapper.mapDataToTask(rawTasks[i]);

        tasks.push(task);
        taskMap.set(task._id, task);
      }
    }

    this.setState({ taskMap, tasks });
  }

  // Database can be undefined, until it is set componentDidMount.
  // This function will handle the case of undefined database.
  validateDatabase(): void {
    if (this.db === undefined) {
      throw new Error("this.db is undefined!");
    }
  }

  // TODO: This could be an enum.
  validateCurrentList(): boolean {
    const { currentList } = this.state;

    return currentList >= 0 && currentList <= 1;
  }

  startTask(taskId: string): void {
    this.setState({
      currentTask: taskId,
      stateVar: StateVars.TaskRunningState,
    });
    ipcRenderer.send("setLuxaforWork");
  }

  // We take a taskId here, because if the TaskRunningView wants to update a task while it's being unmounted,
  // this.state.currentTask will already have been set to an empty string by the state transition function.
  // Thus to handle this case, we will need to pass in the taskId, so the task can be looked up by its id.
  // In most cases this.state.currentTask will have a valid value.
  updateTaskTimeSpentOnTask(taskId: string, timeSpentOnTask: number): void {
    if (this.db === undefined) {
      throw new Error("this.db is undefined!");
    }

    const task: Task = this.getTaskById(taskId);
    task.timeSpent += timeSpentOnTask;

    // eslint-disable-next-line no-console
    console.log("task: ", task);

    this.db
      .upsert(task)
      .then((rev) => {
        if (rev === undefined) {
          throw new Error("updateTaskTimeSpentOnTask: rev is undefined!");
        }

        task._rev = rev;
        ipcRenderer.send("showNotification", "taskUpdated");
        this.loadState().catch((error) => {
          // eslint-disable-next-line no-console
          console.log("Caught error: ", error);
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("error: ", error);
      });
  }

  // TODO: There is some duplicated code in these two methods, consider extracting the common code.

  // Called by TaskRunningView: Assumes that there is a current task.
  taskDone(): void {
    if (this.db === undefined) {
      throw new Error("this.db is undefined!");
    }

    ipcRenderer.send("setLuxaforOff");
    const task = this.getCurrentTask();
    task.done = true;
    this.db
      .upsert(task)
      .then((rev) => {
        if (rev === undefined) {
          throw new Error("taskDone: rev is undefined!");
        }

        task._rev = rev;
        ipcRenderer.send("showNotification", "taskDone");
        this.loadState().catch((error) => {
          // eslint-disable-next-line no-console
          console.log("Caught error: ", error);
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("error: ", error);
      });
  }

  // Called by EditTaskView: Must get task from dataMap, as there is no current task.
  taskDoneById(taskId: string): void {
    const { taskMap } = this.state;

    if (this.db === undefined) {
      throw new Error("this.db is undefined!");
    }

    ipcRenderer.send("setLuxaforOff");
    if (taskMap.has(taskId)) {
      const task = this.getTaskById(taskId);
      task.done = true;
      this.db
        .upsert(task)
        .then((rev) => {
          if (rev === undefined) {
            throw new Error("taskDoneById: rev is undefined!");
          }

          task._rev = rev;
          ipcRenderer.send("showNotification", "taskDone");
          this.loadState().catch((error) => {
            // eslint-disable-next-line no-console
            console.log("Caught error: ", error);
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log("error: ", error);
        });
    }
  }

  togglePouchdbDebug(): void {
    if (this.db !== undefined) {
      this.pouchdbDebug = !this.pouchdbDebug;

      if (this.pouchdbDebug) {
        this.db.enableDebug();
      } else {
        this.db.disableDebug();
      }
    } else {
      throw new Error("togglePouchDBDebug: this.db is undefined!");
    }
  }

  // State transition functions.

  appStateUpdate(newState: StateVars, taskId: string, labelId: string): void {
    this.setState({
      currentTask: taskId,
      currentLabel: labelId,
      stateVar: newState,
    });
  }

  render(): React.ReactNode {
    const { stateVar, labels, tasks, currentList } = this.state;
    const { changeTheme } = this.props;

    switch (stateVar) {
      case StateVars.MainViewState:
        return (
          <div>
            <MainView
              tasks={tasks}
              labels={labels}
              currentList={currentList}
              startTask={this.startTask}
              taskDoneById={this.taskDoneById}
              setCurrentList={this.setCurrentList}
              appStateUpdate={this.appStateUpdate}
              removeTask={this.removeTask}
              removeLabel={this.removeLabel}
              setFilter={this.setFilter}
            />
          </div>
        );
      case StateVars.TaskRunningState:
        return (
          <div>
            <TaskRunningView
              task={this.getCurrentTask()}
              updateTaskTimeSpentOnTask={this.updateTaskTimeSpentOnTask}
              taskDone={this.taskDone}
              stopTask={this.stopTask}
            />
          </div>
        );
      case StateVars.EditSettingsState:
        return (
          <div>
            <EditSettingsView
              appStateUpdate={this.appStateUpdate}
              changeTheme={changeTheme}
            />
          </div>
        );
      case StateVars.EditTaskState:
        return (
          <div>
            <EditTaskView
              newTask={false}
              title="Task Editor"
              task={this.getCurrentTask()}
              labels={labels}
              editTask={this.editTask}
              appStateUpdate={this.appStateUpdate}
            />
          </div>
        );
      case StateVars.AddNewTaskState:
        return (
          <div>
            <EditTaskView
              newTask
              title="Add New Task"
              task={new Task(uuidv4(), "", "")}
              labels={labels}
              editTask={this.editTask}
              appStateUpdate={this.appStateUpdate}
            />
          </div>
        );
      case StateVars.ViewTaskState:
        return (
          <ViewTaskView
            task={this.getCurrentTask()}
            getLabelById={this.getLabelById}
            appStateUpdate={this.appStateUpdate}
          />
        );
      case StateVars.ViewLabelState:
        return (
          <ViewLabelView
            label={this.getCurrentLabel()}
            getLabelById={this.getLabelById}
            appStateUpdate={this.appStateUpdate}
          />
        );
      case StateVars.EditLabelState:
        return (
          <EditLabelView
            title="Edit Label"
            label={this.getCurrentLabel()}
            labels={labels}
            editLabel={this.editLabel}
            appStateUpdate={this.appStateUpdate}
          />
        );
      case StateVars.AddNewLabelState:
        return (
          <EditLabelView
            title="Add New Label"
            label={new Label(uuidv4())}
            labels={labels}
            editLabel={this.editLabel}
            appStateUpdate={this.appStateUpdate}
          />
        );

      default:
        return "";
    }
  }
}

export default App;
