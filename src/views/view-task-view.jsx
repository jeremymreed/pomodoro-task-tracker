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
import electronSettings from 'electron-settings';
import { withStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';

const styles = () => ({
  name: {
    marginBottom: '5px'
  },
  description: {
    marginTop: '5px',
    marginBottom: '5px'
  },
  done: {
    marginTop: '5px',
    marginBottom: '5px'
  },
  exitButton: {
    marginTop: '5px',
  }
});

class ViewTaskView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.task.name,
      description: this.props.task.description,
      timeSpent: this.props.task.timeSpent,
      label: this.props.task.label,
      done: this.props.task.done
    }
  }

  getTimeString(timeInSeconds) {
    const durationInSeconds = moment.duration(timeInSeconds, 'seconds');
    if (electronSettings.getSync('shouldDisplaySeconds')) {
      return humanizeDuration(durationInSeconds, {round: false, maxDecimalPoints: 0, units: ['d', 'h', 'm', 's']});
    } else {
      return humanizeDuration(durationInSeconds, {round: false, maxDecimalPoints: 0, units: ['d', 'h', 'm']});
    }
  }

  exit(event) {
    event.preventDefault();

    this.props.closeViewTaskView();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="h1" align="center">Task</Typography>

        <FormGroup>
          <TextField
            className="name"
            label="Name"
            multiline
            rows={4}
            defaultValue={this.state.name}
            inputProps={{readOnly: true}}
          />

          <TextField
            className="label"
            label="Label"
            defaultValue={this.state.label}
            inputProps={{readOnly: true}}
          />

          <TextField
            className="name"
            label="Time spent on task"
            defaultValue={this.getTimeString(this.state.timeSpent)}
            inputProps={{readOnly: true}}
          />

          <TextField
            className="description"
            label="Description"
            multiline
            rows={4}
            defaultValue={ this.state.description }
            inputProps={{readOnly: true}}
          />

          <FormControlLabel
            className="done"
            control= {<Checkbox
              checked={ this.state.done }
              color="primary"
              inputProps={{ readOnly: true, 'aria-label': 'task done checkbox' }}
            />}
            label="Done"
          />

          <span>
            <Button className={classes.exitButton} variant="contained" color="primary" onClick={(e) => this.exit(e)}>Exit</Button>
          </span>
        </FormGroup>
      </div>
    );
  }
}

ViewTaskView.propTypes = {
  classes: PropTypes.object,
  task: PropTypes.object,
  closeViewTaskView: PropTypes.func
}

export default withStyles(styles)(ViewTaskView);
