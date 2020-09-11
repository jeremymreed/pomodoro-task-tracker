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
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DoneIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = () => ({
  divTable: {
    overflowY: 'scroll',
    minWidth: 640,
    maxHeight: 425
  },
  table: {
    minWidth: 640,
  },
  taskNameContainer: {
    maxWidth: 200,
  },
  taskActionButtonGroup: {
    marginLeft: '5px',
    marginRight: '5px'
  },
  addTaskButton: {
    marginTop: '15px',
  },
  themeFormControl: {
    width: 150,
    maxWidth: 150,
  }
});

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.startTask = this.startTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.handleFilterSelectionChange = this.handleFilterSelectionChange.bind(this);

    this.state = {
      selectedFilter: 'all'
    }
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

    this.props.openAddTaskView();
  }

  viewTask(event, taskId) {
    event.preventDefault();

    this.props.openViewTaskView(taskId);
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

    this.props.removeTask(taskId);
  }

  handleFilterSelectionChange(event) {
    event.preventDefault();

    this.setState({selectedFilter: event.target.value});
    this.props.setFilter(event.target.value);
  }

  getDone(done) {
    if (done) {
      return (<DoneIcon />);
    } else {
      return '';
    }
  }

  getEmptyTaskList(classes) {
    // No Tasks.
    const listTasks= (
      <TableRow>
        <TableCell>
          <Typography variant="h6" align="center">You have no tasks.</Typography>
        </TableCell>
      </TableRow>
    );

    return (
      <TableContainer className={classes.divTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormControl className={classes.themeFormControl}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    label="Filter"
                    value={this.state.selectedFilter}
                    onChange={this.handleFilterSelectionChange}
                  >
                    <MenuItem value={'all'}>All</MenuItem>
                    <MenuItem value={'tasksDone'}>Complete</MenuItem>
                    <MenuItem value={'tasksNotDone'}>Incomplete</MenuItem>
                  </Select>

                </FormControl>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { listTasks }
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  getFullTaskList(classes) {
    // We have tasks.
    const listTasks = this.props.data.map((task) => {
      return (
        <TableRow key={ task._id }>
          <TableCell>
            <Container className={classes.taskNameContainer}>
              <Typography noWrap={true}>{ task.name }</Typography>
            </Container>
          </TableCell>
          <TableCell>
            <ButtonGroup className={classes.taskActionButtonGroup}>
              <Button size="small" variant="contained" color="primary" onClick={(e) => this.startTask(e, task._id, task.done)}>
                <PlayArrowIcon />
              </Button>
              { /* <Button size="small" variant="contained" color="primary" onClick={(e) => this.taskDoneById(e, task._id)}>Done</Button> */ }
            </ButtonGroup>
            <ButtonGroup className={classes.taskActionButtonGroup}>
              <Button size="small" variant="contained" color="primary" onClick={(e) => this.viewTask(e, task._id)}>View</Button>
              <Button size="small" variant="contained" color="primary" onClick={(e) => this.editTask(e, task._id)}>
                <EditIcon />
              </Button>
              <Button size="small" variant="contained" color="secondary" onClick={(e) => this.removeTask(e, task._id)}>
                <DeleteIcon />
              </Button>
            </ButtonGroup>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <TableContainer component={Paper} className={classes.divTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6">Name</Typography></TableCell>
              <TableCell>
                <FormControl className={classes.themeFormControl}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    label="Filter"
                    value={this.state.selectedFilter}
                    onChange={this.handleFilterSelectionChange}
                  >
                    <MenuItem value={'all'}>All</MenuItem>
                    <MenuItem value={'tasksDone'}>Complete</MenuItem>
                    <MenuItem value={'tasksNotDone'}>Incomplete</MenuItem>
                  </Select>

                </FormControl>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { listTasks }
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  getTaskList(classes) {
    if (this.props.data.length === 0) {
      return (this.getEmptyTaskList(classes));
    } else {
      return (this.getFullTaskList(classes))
    }
  }

  render () {
    const { classes } = this.props;
    return (
      <div>
        { this.getTaskList(classes) }
        <Button className={classes.addTaskButton} variant="contained" color="primary" onClick={(e) => this.addTask(e)}>Add new task</Button>
      </div>
    );
  }
}

TaskList.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.array,
  openEditTaskView: PropTypes.func,
  openAddTaskView: PropTypes.func,
  openViewTaskView: PropTypes.func,
  startTask: PropTypes.func,
  taskDoneById: PropTypes.func,
  removeTask: PropTypes.func,
  setFilter: PropTypes.func
};

export default withStyles(styles)(TaskList);
