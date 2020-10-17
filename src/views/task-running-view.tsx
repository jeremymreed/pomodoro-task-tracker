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
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import CheckIcon from "@material-ui/icons/Check";
import Timer from "../components/timer";
import Task from "../data-models/task";

/*
  We create custom TextField component with 'disabled' text styling overridden.
  Want to study this technique.
  See: https://stackoverflow.com/questions/62909413/how-to-change-font-color-of-disabled-textfield-material-ui-react-js
*/

const styles = () => ({
  activeTask: {
    display: "inline-block",
  },
  pauseResumeButton: {
    marginTop: "5px",
    marginRight: "5px",
  },
  stopButton: {
    marginTop: "5px",
    marginLeft: "5px",
    marginRight: "5px",
  },
  doneButton: {
    marginTop: "5px",
    marginLeft: "5px",
  },
  containerCenter: {
    alignContent: "center",
  },
});

interface Props extends WithStyles<typeof styles> {
  task: Task;
  updateTaskTimeSpentOnTask: (timeSpentOnTask: number) => void;
  taskDone: () => void;
  stopTask: () => void;
}

interface State {
  shouldRun: boolean;
}

class TaskRunningView extends React.Component<Props, State> {
  getTotalTimeRan: () => number;

  getCurrentPhaseType: () => string;

  constructor(props: Props) {
    super(props);

    this.handleTimerExpiration = this.handleTimerExpiration.bind(this);
    this.submitGetTotalTimeRan = this.submitGetTotalTimeRan.bind(this);
    this.submitGetCurrentPhaseType = this.submitGetCurrentPhaseType.bind(this);

    this.getTotalTimeRan = () => 0;
    this.getCurrentPhaseType = () => "";

    this.state = {
      shouldRun: true,
    };
  }

  componentWillUnmount() {
    this.cleanup();
  }

  _startTimer() {
    this.setState({ shouldRun: true });
  }

  _stopTimer() {
    this.setState({ shouldRun: false });
  }

  // Called by Timer, to pass in its getTotalTimeRan function, so we can call it here.
  submitGetTotalTimeRan(getTotalTimeRan: () => number) {
    this.getTotalTimeRan = getTotalTimeRan;
  }

  submitGetCurrentPhaseType(getCurrentPhaseType: () => string) {
    this.getCurrentPhaseType = getCurrentPhaseType;
  }

  // Called when we will be unmounted.
  cleanup(): void {
    const { updateTaskTimeSpentOnTask } = this.props;

    ipcRenderer.send("setLuxaforOff");
    this._stopTimer();
    updateTaskTimeSpentOnTask(this.getTotalTimeRan());
  }

  // Timer tells us it has expired.
  handleTimerExpiration(type: string) {
    const { updateTaskTimeSpentOnTask } = this.props;

    this._stopTimer();

    updateTaskTimeSpentOnTask(this.getTotalTimeRan());
    if (this.getCurrentPhaseType() === "Work") {
      ipcRenderer.send("setLuxaforRestStrobe");
      ipcRenderer.send("showNotification", "timeToRest");
    } else if (type === "Rest") {
      ipcRenderer.send("setLuxaforWorkStrobe");
      ipcRenderer.send("showNotification", "timeToWork");
    } else {
      throw new Error("Invalid type detected!");
    }
  }

  // User wants to pause the timer.
  handlePause(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { updateTaskTimeSpentOnTask } = this.props;

    event.preventDefault();

    ipcRenderer.send("setLuxaforOff");
    this._stopTimer();
    updateTaskTimeSpentOnTask(this.getTotalTimeRan());
  }

  // User wants to resume the timer.
  handleResume(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();

    this._startTimer();

    const currentPhase = this.getCurrentPhaseType();

    if (currentPhase === "Work") {
      ipcRenderer.send("setLuxaforWork");
    } else if (currentPhase === "Rest") {
      ipcRenderer.send("setLuxaforRest");
    } else {
      throw new Error("Invalid Phase Type detected!");
    }
  }

  // User wants to stop working on this task, and return to the task list.
  // This does not set the task as being 'done'.
  stopTask(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { updateTaskTimeSpentOnTask, stopTask } = this.props;

    event.preventDefault();

    this._stopTimer();
    updateTaskTimeSpentOnTask(this.getTotalTimeRan());
    stopTask();

    ipcRenderer.send("showNotification", "taskStopped");
  }

  // User is done with this task.
  taskDone(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { updateTaskTimeSpentOnTask, stopTask, taskDone } = this.props;

    event.preventDefault();

    this._stopTimer();
    updateTaskTimeSpentOnTask(this.getTotalTimeRan());
    taskDone();
    stopTask();
  }

  render() {
    const { classes, task } = this.props;
    const { shouldRun } = this.state;

    let pauseResumeButton;

    if (shouldRun) {
      pauseResumeButton = (
        <Button
          className={classes.pauseResumeButton}
          variant="contained"
          color="primary"
          onClick={(e) => this.handlePause(e)}
        >
          <PauseIcon />
        </Button>
      );
    } else {
      pauseResumeButton = (
        <Button
          className={classes.pauseResumeButton}
          variant="contained"
          color="primary"
          onClick={(e) => this.handleResume(e)}
        >
          <PlayArrowIcon />
        </Button>
      );
    }
    return (
      <div>
        <Box display="flex" justifyContent="center">
          <Typography className={classes.activeTask} variant="h6">
            {/* Resolve conflict between eslint and prettier */}
            {/* eslint-disable react/jsx-one-expression-per-line */}
            Active Task: {task.name}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center">
          <Timer
            shouldRun={shouldRun}
            handleTimerExpiration={this.handleTimerExpiration}
            submitGetTotalTimeRan={this.submitGetTotalTimeRan}
            submitGetCurrentPhaseType={this.submitGetCurrentPhaseType}
          />
        </Box>

        <Box display="flex" justifyContent="center">
          <TextField
            label="Description"
            multiline
            rows={4}
            defaultValue={task.description}
            inputProps={{ readOnly: true }}
          />
        </Box>

        <Box display="flex" justifyContent="center">
          <p>
            {pauseResumeButton}
            <Button
              className={classes.stopButton}
              variant="contained"
              color="primary"
              onClick={(e) => this.stopTask(e)}
            >
              <StopIcon />
            </Button>
            <Button
              className={classes.doneButton}
              variant="contained"
              color="primary"
              onClick={(e) => this.taskDone(e)}
            >
              <CheckIcon />
            </Button>
          </p>
        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(TaskRunningView);
