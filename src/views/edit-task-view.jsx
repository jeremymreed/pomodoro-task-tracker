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
import { useFormik } from 'formik';
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

function EditTaskView(props) {
    const formik = useFormik({
    initialValues: {
      name: props.task.name,
      description: props.task.description,
      done: props.task.done
    },
    onSubmit: (values) => {
      props.editTask(values.name, values.description, values.done);
      ipcRenderer.send('showNotification', 'taskUpdated');
      props.closeEditTaskView();
    }
  });

  const cancel = () => {
    props.closeEditTaskView();
  }

  const { classes } = props;

  return (
    <div>
      <Typography variant="h1" align="center">{props.title}</Typography>

      <form onSubmit={formik.handleSubmit}>
        <FormGroup>
          <TextField
            id="name"
            name="name"
            type="text"
            className="name"
            label="Name"
            multiline
            rows={4}
            value={formik.values.name}
            onChange={formik.handleChange}
          />

          <TextField
            id="description"
            name="description"
            type="text"
            className="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
          />

          <FormControlLabel
            className="done"
            control= {<Checkbox
              id="done"
              name="done"
              type="checkbox"
              checked={formik.values.done}
              onChange={formik.handleChange}
              color="primary"
              inputProps={{ 'aria-label': 'task done checkbox' }}
            />}
            label="Done"
          />

          <span>
            <Button
              type="submit"
              className={classes.saveButton}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
            <Button className={classes.cancelButton} variant="contained" color="primary" onClick={() => {cancel()}}>Cancel</Button>
          </span>
        </FormGroup>
      </form>
    </div>
  );
}

EditTaskView.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string,
  task: PropTypes.object,
  editTask: PropTypes.func,
  closeEditTaskView: PropTypes.func
}

export default withStyles(styles)(EditTaskView);
