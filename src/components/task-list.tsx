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
import Task from '../data-models/task';
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AddIcon from '@material-ui/icons/Add';

const styles = (): any => ({
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
  taskName: {
    textDecoration: 'underline',
    textTransform: 'none'
  },
  taskButtons: {
    marginLeft: '5px',
    marginRight: '5px',
  },
  addTaskButton: {
    marginTop: '15px',
  },
  themeFormControl: {
    width: 150,
    maxWidth: 150,
  }
});

interface Props {
  classes: object,
  tasks: Array<Task>,
  openEditTaskView: Function,
  openAddTaskView: Function,
  openViewTaskView: Function,
  startTask: Function,
  taskDoneById: Function,
  removeTask: Function,
  setFilter: Function
}

interface State {
  selectedFilter: string
}

class TaskList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.startTask = this.startTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.handleFilterSelectionChange = this.handleFilterSelectionChange.bind(this);

    this.state = {
      selectedFilter: 'all'
    }
  }

  startTask(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, taskId: string, done: boolean) {
    event.preventDefault();

    if (!done) {
      this.props.startTask(taskId);
    } else {
      ipcRenderer.send('showNotification', 'disallow-start-task-when-done')
    }
  }

  addTask(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();

    this.props.openAddTaskView();
  }

  viewTask(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, taskId: string) {
    event.preventDefault();

    this.props.openViewTaskView(taskId);
  }

  editTask(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, taskId: string) {
    event.preventDefault();

    this.props.openEditTaskView(taskId)
  }

  taskDoneById(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, taskId: string, taskDone: boolean) {
    event.preventDefault();

    if (!taskDone) {
      this.props.taskDoneById(taskId);
    }
  }

  removeTask(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, taskId: string) {
    event.preventDefault();

    this.props.removeTask(taskId);
  }

  // TODO: Use any here for now, the actual type is rather complex.
  // TODO: We'll handle it properly later.
  handleFilterSelectionChange(event: any) {
    event.preventDefault();

    this.setState({selectedFilter: event.target.value});
    this.props.setFilter(event.target.value);
  }

  getDone(done: boolean) {
    if (done) {
      return (<CheckCircleIcon />);
    } else {
      return (<RadioButtonUncheckedIcon />);
    }
  }

  getEmptyTaskList(classes: any) {
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

  getFullTaskList(classes: any) {
    // We have tasks.
    const listTasks = this.props.tasks.map((task) => {
      return (
        <TableRow key={ task._id }>
          <TableCell>
            <Button size="small" onClick={(e) => this.taskDoneById(e, task._id, task.done)}>
              { this.getDone(task.done) }
            </Button>
          </TableCell>
          <TableCell>
            <Container className={classes.taskNameContainer}>
              <Button className={ classes.taskButtons } size="small" onClick={(e) => this.viewTask(e, task._id)}>
                <Typography className={ classes.taskName } variant="button" noWrap={true}>
                  {task.name}
                </Typography>
              </Button>
            </Container>
          </TableCell>
          <TableCell>
            <Button className={ classes.taskButtons } size="small" variant="contained" color="primary" onClick={(e) => this.startTask(e, task._id, task.done)}>
              <PlayArrowIcon />
            </Button>
            <Button className={ classes.taskButtons } size="small" variant="contained" color="primary" onClick={(e) => this.editTask(e, task._id)}>
              <EditIcon />
            </Button>
            <Button className={ classes.taskButtons } size="small" variant="contained" color="secondary" onClick={(e) => this.removeTask(e, task._id)}>
              <DeleteIcon />
            </Button>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <TableContainer component={Paper} className={classes.divTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
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

  getTaskList(classes: any) {
    if (this.props.tasks.length === 0) {
      return (this.getEmptyTaskList(classes));
    } else {
      return (this.getFullTaskList(classes))
    }
  }

  render () {
    const { classes }: any = this.props;

    return (
      <div>
        { this.getTaskList(classes) }
        <Button className={classes.addTaskButton} variant="contained" color="primary" onClick={(e) => this.addTask(e)}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(TaskList);
