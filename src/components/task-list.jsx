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
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import electronSettings from 'electron-settings';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';

const styles = () => ({
  table: {
    minWidth: 500,
  },
  button: {
    marginTop: '15px',
  }
});

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.startTask = this.startTask.bind(this);
    this.editTask = this.editTask.bind(this);
  }

  startTask(event, taskId, done) {
    event.preventDefault();

    if (!done) {
      this.props.startTask(taskId);
    } else {
      ipcRenderer.send('showNotification', 'disallow-start-task-when-done')
    }
  }

  addTask(event) {
    event.preventDefault();

    this.props.openEditTaskView(-1);
  }

  editTask(event, taskId) {
    event.preventDefault();

    this.props.openEditTaskView(taskId)
  }

  taskDoneById(event, taskId) {
    event.preventDefault();

    this.props.taskDoneById(taskId);
  }

  removeTask(event, taskId) {
    event.preventDefault();

    ipcRenderer.send('removeTask', taskId);
  }

  getDone(done) {
    if (done) {
      return '✓';
    } else {
      return '';
    }
  }

  getTimeString(timeInSeconds) {
    const durationInSeconds = moment.duration(timeInSeconds, 'seconds');
    if (electronSettings.getSync('shouldDisplaySeconds')) {
      return humanizeDuration(durationInSeconds, {round: false, maxDecimalPoints: 2, units: ['d', 'h', 'm', 's']});
    } else {
      return humanizeDuration(durationInSeconds, {round: false, maxDecimalPoints: 2, units: ['d', 'h', 'm']});
    }
  }

  getTaskList(classes) {
    const listTasks = this.props.data.map((task) => {
      return (
        <TableRow key={ task.id }>
          <TableCell>{ task.name }</TableCell>
          <TableCell>{ this.getTimeString(task.timeSpent) }</TableCell>
          <TableCell>{ this.getDone(task.done) }</TableCell>
          <TableCell><button onClick={(e) => this.startTask(e, task.id, task.done)}>Start</button></TableCell>
          <TableCell><button onClick={(e) => this.taskDoneById(e, task.id)}>Done</button></TableCell>
          <TableCell><button onClick={(e) => this.editTask(e, task.id)}>Edit</button></TableCell>
          <TableCell><button className="remove-button" onClick={(e) => this.removeTask(e, task.id)}>Remove</button></TableCell>
        </TableRow>
      );
    });

    return (
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Done</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { listTasks }
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  render () {
    const { classes } = this.props;
    return (
      <div>
        { this.getTaskList(classes) }
        <Button className={classes.button} variant="outlined" color="primary" onClick={(e) => this.addTask(e)}>Add new task</Button>
      </div>
    );
  }
}

TaskList.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.array,
  openEditTaskView: PropTypes.func,
  startTask: PropTypes.func,
  taskDoneById: PropTypes.func
};

export default withStyles(styles)(TaskList);
