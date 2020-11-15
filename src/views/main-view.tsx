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

import React from "react";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TaskFilter from "../enums/task-filter-enum";
import TaskList from "../components/task-list";
import LabelList from "../components/label-list";
import StateVars from "../enums/state-vars-enum";
import CurrentListState from "../enums/current-list-state-enum";
import Task from "../data-models/task";
import Label from "../data-models/label";

interface Props {
  tasks: Array<Task>;
  labels: Array<Label>;
  currentList: CurrentListState;
  setCurrentList: (newView: number) => void;
  appStateUpdate: (
    newState: StateVars,
    taskId: string,
    labelId: string
  ) => void;
  openViewLabelView: (labelId: string) => void;
  openEditLabelView: (labelId: string) => void;
  openAddLabelView: () => void;
  startTask: (taskId: string) => void;
  taskDoneById: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  removeLabel: (labelId: string) => void;
  setFilter: (filterName: TaskFilter) => void;
}

function MainView(props: Props): React.ReactElement {
  const { currentList } = props;

  const handleTabChange = (
    event: React.ChangeEvent<unknown>,
    value: CurrentListState
  ): void => {
    const { setCurrentList } = props;

    setCurrentList(value);
  };

  const renderList = (): React.ReactElement => {
    const {
      tasks,
      labels,
      startTask,
      taskDoneById,
      appStateUpdate,
      removeTask,
      setFilter,
      openViewLabelView,
      openEditLabelView,
      openAddLabelView,
      removeLabel,
    } = props;

    if (currentList === CurrentListState.taskListState) {
      return (
        <TaskList
          tasks={tasks}
          startTask={startTask}
          taskDoneById={taskDoneById}
          appStateUpdate={appStateUpdate}
          removeTask={removeTask}
          setFilter={setFilter}
        />
      );
    }

    if (currentList === CurrentListState.labelListState) {
      return (
        <LabelList
          labels={labels}
          openViewLabelView={openViewLabelView}
          openEditLabelView={openEditLabelView}
          openAddLabelView={openAddLabelView}
          removeLabel={removeLabel}
        />
      );
    }

    throw new Error("renderList: invalid CurrentListState!");
  };

  return (
    <div>
      <Typography variant="h3" align="center">
        Pomodoro Task Tracker
      </Typography>
      <Tabs value={currentList} onChange={handleTabChange}>
        <Tab label="Tasks" />
        <Tab label="Labels" />
      </Tabs>
      {renderList()}
    </div>
  );
}

export default MainView;
