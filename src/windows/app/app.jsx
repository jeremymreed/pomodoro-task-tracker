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
import MainView from '../../views/main-view';
import TaskRunningView from '../../views/task-running-view';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.toggleTaskRunning = this.toggleTaskRunning.bind(this);

    // Place all App state variables here.
    this.state = {
      showEditTask: false,  // Show EditTaskDialog.
      taskRunning: false    // Show TaskRunningView.
    }
  }

  validateState() {
    // showEditTask and taskRunning cannot both be true.
    return !(this.showEditTask && this.taskRunning);
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
    if (this.state.taskRunning) {
      return (
        <div>
          <TaskRunningView path='/' toggleTaskRunning={ this.toggleTaskRunning }/>
        </div>
      );
    } else {
      return (
        <div>
          <MainView path='/' toggleTaskRunning={ this.toggleTaskRunning }/>
        </div>
      );
    }
  }
}

export default App;
