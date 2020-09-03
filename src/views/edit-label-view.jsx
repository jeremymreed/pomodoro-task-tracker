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
import { useFormik } from 'formik';
import { withStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
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

const validate = (values) => {
  const errors = {};

  if (!values.name || values.name === '') {
    errors.name = 'The name is required';
  }

  return errors;
}

function EditLabelView(props) {
    const formik = useFormik({
    initialValues: {
      name: props.label.name,
      description: props.label.description
    },
    validate,
    onSubmit: (values) => {
      props.editLabel(values.name, values.description);
      props.closeEditLabelView();
    }
  });

  const cancel = () => {
    props.closeEditLabelView();
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

          <span>
            <Button
              type="submit"
              className={classes.saveButton}
              variant="contained"
              color="primary"
              disabled={disableSaveButton()}
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

EditLabelView.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string,
  label: PropTypes.object,
  editLabel: PropTypes.func,
  closeEditLabelView: PropTypes.func
}

export default withStyles(styles)(EditLabelView);
