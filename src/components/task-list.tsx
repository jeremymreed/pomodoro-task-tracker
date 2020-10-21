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
import { ipcRenderer } from "electron";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AddIcon from "@material-ui/icons/Add";
import Task from "../data-models/task";
import TaskFilter from "../enums/task-filter-enum";

const styles = createStyles({
  divTable: {
    overflowY: "scroll",
    minWidth: 640,
    maxHeight: 425,
  },
  table: {
    minWidth: 640,
  },
  taskNameContainer: {
    maxWidth: 200,
  },
  taskName: {
    textDecoration: "underline",
    textTransform: "none",
  },
  taskButtons: {
    marginLeft: "5px",
    marginRight: "5px",
  },
  addTaskButton: {
    marginTop: "15px",
  },
  themeFormControl: {
    width: 150,
    maxWidth: 150,
  },
});

interface Props extends WithStyles<typeof styles> {
  tasks: Array<Task>;
  openEditTaskView: (taskId: string) => void;
  openAddTaskView: () => void;
  openViewTaskView: (taskId: string) => void;
  startTask: (taskId: string) => void;
  taskDoneById: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  setFilter: (filterName: TaskFilter) => void;
}

interface State {
  selectedFilter: TaskFilter;
}

const getDone = (done: boolean) => {
  if (done) {
    return <CheckCircleIcon />;
  }

  return <RadioButtonUncheckedIcon />;
};

class TaskList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.startTask = this.startTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.handleFilterSelectionChange = this.handleFilterSelectionChange.bind(
      this
    );

    this.state = {
      selectedFilter: TaskFilter.All,
    };
  }

  getEmptyTaskList() {
    const { classes } = this.props;
    const { selectedFilter } = this.state;

    // No Tasks.
    const listTasks = (
      <TableRow>
        <TableCell>
          <Typography variant="h6" align="center">
            You have no tasks.
          </Typography>
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
                    value={selectedFilter}
                    onChange={this.handleFilterSelectionChange}
                  >
                    <MenuItem value={TaskFilter.All}>All</MenuItem>
                    <MenuItem value={TaskFilter.Done}>Complete</MenuItem>
                    <MenuItem value={TaskFilter.NotDone}>Incomplete</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{listTasks}</TableBody>
        </Table>
      </TableContainer>
    );
  }

  getFullTaskList() {
    const { classes, tasks } = this.props;
    const { selectedFilter } = this.state;

    // We have tasks.
    const listTasks = tasks.map((task) => {
      return (
        <TableRow key={task._id}>
          <TableCell>
            <Button
              size="small"
              onClick={(e) => this.taskDoneById(e, task._id, task.done)}
            >
              {getDone(task.done)}
            </Button>
          </TableCell>
          <TableCell>
            <Container className={classes.taskNameContainer}>
              <Button
                className={classes.taskButtons}
                size="small"
                onClick={(e) => this.viewTask(e, task._id)}
              >
                <Typography
                  className={classes.taskName}
                  variant="button"
                  noWrap
                >
                  {task.name}
                </Typography>
              </Button>
            </Container>
          </TableCell>
          <TableCell>
            <Button
              className={classes.taskButtons}
              size="small"
              variant="contained"
              color="primary"
              onClick={(e) => this.startTask(e, task._id, task.done)}
            >
              <PlayArrowIcon />
            </Button>
            <Button
              className={classes.taskButtons}
              size="small"
              variant="contained"
              color="primary"
              onClick={(e) => this.editTask(e, task._id)}
            >
              <EditIcon />
            </Button>
            <Button
              className={classes.taskButtons}
              size="small"
              variant="contained"
              color="secondary"
              onClick={(e) => this.removeTask(e, task._id)}
            >
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
              <TableCell />
              <TableCell>
                <Typography variant="h6">Name</Typography>
              </TableCell>
              <TableCell>
                <FormControl className={classes.themeFormControl}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    label="Filter"
                    value={selectedFilter}
                    onChange={this.handleFilterSelectionChange}
                  >
                    <MenuItem value={TaskFilter.All}>All</MenuItem>
                    <MenuItem value={TaskFilter.Done}>Complete</MenuItem>
                    <MenuItem value={TaskFilter.NotDone}>Incomplete</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{listTasks}</TableBody>
        </Table>
      </TableContainer>
    );
  }

  getTaskList() {
    const { tasks } = this.props;

    if (tasks.length === 0) {
      return this.getEmptyTaskList();
    }

    return this.getFullTaskList();
  }

  startTask(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    taskId: string,
    done: boolean
  ) {
    const { startTask } = this.props;

    event.preventDefault();

    if (!done) {
      startTask(taskId);
    } else {
      ipcRenderer.send("showNotification", "disallow-start-task-when-done");
    }
  }

  addTask(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { openAddTaskView } = this.props;

    event.preventDefault();

    openAddTaskView();
  }

  viewTask(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    taskId: string
  ) {
    const { openViewTaskView } = this.props;
    event.preventDefault();

    openViewTaskView(taskId);
  }

  editTask(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    taskId: string
  ) {
    const { openEditTaskView } = this.props;

    event.preventDefault();

    openEditTaskView(taskId);
  }

  taskDoneById(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    taskId: string,
    taskDone: boolean
  ) {
    const { taskDoneById } = this.props;

    event.preventDefault();

    if (!taskDone) {
      taskDoneById(taskId);
    }
  }

  removeTask(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    taskId: string
  ) {
    const { removeTask } = this.props;

    event.preventDefault();

    removeTask(taskId);
  }

  // TODO: Use any here for now, the actual type is rather complex.
  // TODO: We'll handle it properly later.  Not sure how to handle this one.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFilterSelectionChange(event: any) {
    const { setFilter } = this.props;

    event.preventDefault();

    this.setState({ selectedFilter: event.target.value });
    setFilter(event.target.value);
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.getTaskList()}
        <Button
          className={classes.addTaskButton}
          variant="contained"
          color="primary"
          onClick={(e) => this.addTask(e)}
        >
          <AddIcon />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(TaskList);
