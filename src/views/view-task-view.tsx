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
import electronSettings from "electron-settings";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import humanizeDuration from "humanize-duration";
import CancelIcon from "@material-ui/icons/Cancel";
import Task from "../data-models/task";
import Label from "../data-models/label";
import StateVars from "../enums/state-vars-enum";

const styles = () => ({
  name: {
    marginBottom: "5px",
  },
  description: {
    marginTop: "5px",
    marginBottom: "5px",
  },
  done: {
    marginTop: "5px",
    marginBottom: "5px",
  },
  exitButton: {
    marginTop: "5px",
  },
});

interface Props extends WithStyles<typeof styles> {
  task: Task;
  appStateUpdate: (
    newState: StateVars,
    taskId: string,
    labelId: string
  ) => void;
  getLabelById: (labelId: string) => Label;
}

interface State {
  name: string;
  description: string;
  timeSpent: number;
  done: boolean;
}

const getTimeString = (timeInSeconds: number) => {
  if (electronSettings.getSync("shouldDisplaySeconds")) {
    return humanizeDuration(timeInSeconds * 1000, {
      round: false,
      maxDecimalPoints: 0,
      units: ["d", "h", "m", "s"],
    });
  }

  return humanizeDuration(timeInSeconds * 1000, {
    round: false,
    maxDecimalPoints: 0,
    units: ["d", "h", "m"],
  });
};

class ViewTaskView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { task } = this.props;

    this.state = {
      name: task.name,
      description: task.description,
      timeSpent: task.timeSpent,
      done: task.done,
    };
  }

  getLabelName() {
    const { task, getLabelById } = this.props;

    if (task.labelId === "") {
      return "";
    }

    const label = getLabelById(task.labelId);

    return label.name;
  }

  getDoneCheckbox() {
    const { done } = this.state;

    return (
      <Checkbox
        checked={done}
        color="primary"
        inputProps={{
          readOnly: true,
          "aria-label": "task done checkbox",
        }}
      />
    );
  }

  exit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { appStateUpdate } = this.props;

    event.preventDefault();

    appStateUpdate(StateVars.MainViewState, "", "");
  }

  render() {
    const { classes } = this.props;
    const { name, description, timeSpent } = this.state;

    return (
      <div>
        <Typography variant="h1" align="center">
          Task
        </Typography>

        <FormGroup>
          <TextField
            className="name"
            label="Name"
            multiline
            rows={4}
            defaultValue={name}
            inputProps={{ readOnly: true }}
          />

          <TextField
            className="label"
            label="Label"
            defaultValue={this.getLabelName()}
            inputProps={{ readOnly: true }}
          />

          <TextField
            className="name"
            label="Time spent on task"
            defaultValue={getTimeString(timeSpent)}
            inputProps={{ readOnly: true }}
          />

          <TextField
            className="description"
            label="Description"
            multiline
            rows={4}
            defaultValue={description}
            inputProps={{ readOnly: true }}
          />

          <FormControlLabel
            className="done"
            label="Done"
            control={this.getDoneCheckbox()}
          />

          <span>
            <Button
              className={classes.exitButton}
              variant="contained"
              color="primary"
              onClick={(e) => this.exit(e)}
            >
              <CancelIcon />
            </Button>
          </span>
        </FormGroup>
      </div>
    );
  }
}

export default withStyles(styles)(ViewTaskView);
