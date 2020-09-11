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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = () => ({
  labelSelectFormControl: {
    maxWidth: 150,
    marginTop: '15px'
  },
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

const validate = (values) => {
  const errors = {};

  if (!values.name || values.name === '') {
    errors.name = 'The name is required';
  }

  return errors;
}

const mapLabelIdToValue = (labelId) => {
  if (labelId === '') {
    return 'none';
  }

  return labelId;
}

const mapValueToLabelId = (value) => {
  if (value === 'none') {
    return '';
  }

  return value;
}

function EditTaskView(props) {
    const formik = useFormik({
    initialValues: {
      name: props.task.name,
      description: props.task.description,
      label: mapLabelIdToValue(props.task.label),
      done: props.task.done
    },
    validate,
    onSubmit: (values) => {
      props.editTask(
        values.name,
        values.description,
        mapValueToLabelId(values.label),
        values.done
      );
      ipcRenderer.send('showNotification', 'taskUpdated');
      props.closeEditTaskView();
    }
  });

  const getLabelMenuItems = () => {
    let labelMenuItems = Array();

    labelMenuItems.push(<MenuItem key={0} value='none'>None</MenuItem>);

    for ( let i = 0 ; i < props.labels.length ; i++ ) {
      labelMenuItems.push(<MenuItem key={props.labels[i]._id} value={props.labels[i]._id}>{props.labels[i].name}</MenuItem>)
    }

    return labelMenuItems;
  };

  const getDoneCheckbox = () => {
    if (!props.newTask) {
      return (
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
      );
    }

    return '';
  }

  const cancel = () => {
    props.closeEditTaskView();
  }

  // TODO: See if there's a better way to do this.  The save button must be disabled while the form is not fully filled out.
  const disableSaveButton = () => {
    return Object.keys(formik.errors).length !== 0 || formik.values.name === '';
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
            onChange={formik.handleChange }
            error={formik.errors.name ? true : false}
            helperText={formik.errors.name ? formik.errors.name : ''}
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

          <FormControl className={classes.labelSelectFormControl} variant="outlined">
            <InputLabel>Label</InputLabel>
            <Select
              id="label"
              name="label"
              label="Label"
              value={formik.values.label}
              onChange={formik.handleChange}
            >
              { getLabelMenuItems() }
            </Select>
          </FormControl>

          { getDoneCheckbox() }

          <span>
            <Button
              type="submit"
              className={classes.saveButton}
              variant="contained"
              color="primary"
              disabled={disableSaveButton()}
            >
              <SaveIcon />
            </Button>
            <Button className={classes.cancelButton} variant="contained" color="primary" onClick={() => {cancel()}}>
              <CancelIcon />
            </Button>
          </span>
        </FormGroup>
      </form>
    </div>
  );
}

EditTaskView.propTypes = {
  classes: PropTypes.object,
  newTask: PropTypes.bool,
  title: PropTypes.string,
  task: PropTypes.object,
  labels: PropTypes.array,
  editTask: PropTypes.func,
  closeEditTaskView: PropTypes.func
}

export default withStyles(styles)(EditTaskView);
