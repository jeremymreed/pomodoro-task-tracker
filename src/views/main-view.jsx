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
import TaskList from '../components/task-list';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class MainView extends React.Component {
  constructor (props) {
    super(props);
  }

  editSettings(event) {
    event.preventDefault();

    this.props.openEditSettingsView();
  }

  render() {
    return (
      <div>
        <Typography variant="h3" align="center">Pomodoro Task Tracker</Typography>
        <Tabs value={0}>
          <Tab label="Tasks" />
          <Tab label="Labels" />
        </Tabs>
        <TaskList
          data={this.props.data}
          startTask={ this.props.startTask }
          taskDoneById={ this.props.taskDoneById }
          openEditTaskView={ this.props.openEditTaskView }
          openAddTaskView={ this.props.openAddTaskView }
          openViewTaskView={ this.props.openViewTaskView }
          removeTask={ this.props.removeTask }
          setFilter={ this.props.setFilter }
        />
      </div>
    );
  }
}

MainView.propTypes = {
  data: PropTypes.array,
  openEditTaskView: PropTypes.func,
  openAddTaskView: PropTypes.func,
  openEditSettingsView: PropTypes.func,
  openViewTaskView: PropTypes.func,
  startTask: PropTypes.func,
  taskDoneById: PropTypes.func,
  removeTask: PropTypes.func,
  setFilter: PropTypes.func
};

export default MainView;
