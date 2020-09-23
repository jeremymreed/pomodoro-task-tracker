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
import TaskList from "../components/task-list";
import LabelList from "../components/label-list";
import CurrentListState from "../enums/current-list-state-enum";
import Task from "../data-models/task";
import Label from "../data-models/label";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

interface Props {
  tasks: Array<Task>;
  labels: Array<Label>;
  currentList: CurrentListState;
  setCurrentList: Function;
  openEditTaskView: Function;
  openAddTaskView: Function;
  openEditSettingsView: Function;
  openViewTaskView: Function;
  openViewLabelView: Function;
  openEditLabelView: Function;
  openAddLabelView: Function;
  startTask: Function;
  taskDoneById: Function;
  removeTask: Function;
  removeLabel: Function;
  setFilter: Function;
}

class MainView extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(event: any, newValue: CurrentListState) {
    this.props.setCurrentList(newValue);
  }

  renderList() {
    if (this.props.currentList === CurrentListState.taskListState) {
      return (
        <TaskList
          tasks={this.props.tasks}
          startTask={this.props.startTask}
          taskDoneById={this.props.taskDoneById}
          openEditTaskView={this.props.openEditTaskView}
          openAddTaskView={this.props.openAddTaskView}
          openViewTaskView={this.props.openViewTaskView}
          removeTask={this.props.removeTask}
          setFilter={this.props.setFilter}
        />
      );
    } else if (this.props.currentList === CurrentListState.labelListState) {
      return (
        <LabelList
          labels={this.props.labels}
          openViewLabelView={this.props.openViewLabelView}
          openEditLabelView={this.props.openEditLabelView}
          openAddLabelView={this.props.openAddLabelView}
          removeLabel={this.props.removeLabel}
        />
      );
    }
  }

  render() {
    return (
      <div>
        <Typography variant="h3" align="center">
          Pomodoro Task Tracker
        </Typography>
        <Tabs value={this.props.currentList} onChange={this.handleTabChange}>
          <Tab label="Tasks" />
          <Tab label="Labels" />
        </Tabs>
        {this.renderList()}
      </div>
    );
  }
}

export default MainView;
