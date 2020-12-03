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
import { withStyles, WithStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/Cancel";
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
  label: Label;
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
}

class ViewLabelView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { label } = this.props;

    this.state = {
      name: label.name,
      description: label.description,
    };
  }

  getLabelLabelName() {
    const { label, getLabelById } = this.props;

    if (label.labelId === "") {
      return "";
    }

    const labelLabel = getLabelById(label.labelId);

    return labelLabel.name;
  }

  exit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { appStateUpdate } = this.props;

    event.preventDefault();

    appStateUpdate(StateVars.MainViewState, "", "");
  }

  render() {
    const { classes } = this.props;
    const { name, description } = this.state;

    return (
      <div>
        <Typography variant="h1" align="center">
          Label
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
            defaultValue={this.getLabelLabelName()}
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

export default withStyles(styles)(ViewLabelView);
