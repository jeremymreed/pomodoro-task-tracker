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
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
  saveButton: {
    marginTop: '5px',
    marginRight: '5px'
  },
  cancelButton: {
    marginTop: '5px',
    marginLeft: '5px'
  }
});

class EditTaskView extends React.Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleDoneChange = this.handleDoneChange.bind(this);

    this.state = {
      name: this.props.task.name,
      description: this.props.task.description,
      done: this.props.task.done
    }
  }

  handleNameChange(event) {
    const newName = event.target.value;
    this.setState({name: newName});
  }

  handleDescriptionChange(event) {
    const newDescription = event.target.value;
    this.setState({description: newDescription});
  }

  handleDoneChange() {
    this.setState({done: !this.state.done});
  }

  formSubmit(event) {
    event.preventDefault();

    this.props.editTask(this.state.name, this.state.description, this.state.done);
    ipcRenderer.send('showNotification', 'taskUpdated');
    this.props.closeEditTaskView();
  }

  cancelEdit(event) {
    event.preventDefault();

    this.props.closeEditTaskView();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="h1" align="center">Task Editor</Typography>

        <FormGroup>
          <TextField className="name" label="Name" defaultValue={this.state.name} onChange={(event) => this.handleNameChange(event)} />

          <TextField
            className="description"
            label="Description"
            multiline
            rows={4}
            defaultValue={ this.state.description }
            onChange={(event) => this.handleDescriptionChange(event)}
          />

          <FormControlLabel
            className="done"
            control= {<Checkbox
              checked={ this.state.done }
              onChange={() => this.handleDoneChange()}
              color="primary"
              inputProps={{ 'aria-label': 'task done checkbox' }}
            />}
            label="Done"
          />

          <span>
            <Button className={classes.saveButton} variant="outlined" color="primary" onClick={(e) => this.formSubmit(e)}>Save</Button>
            <Button className={classes.cancelButton} variant="outlined" color="primary" onClick={(e) => this.cancelEdit(e)}>Cancel</Button>
          </span>
        </FormGroup>
      </div>
    );
  }
}

EditTaskView.propTypes = {
  classes: PropTypes.object,
  task: PropTypes.object,
  editTask: PropTypes.func,
  closeEditTaskView: PropTypes.func
}

export default withStyles(styles)(EditTaskView);
