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
import { withStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import Label from '../data-models/label';

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

interface Props {
  classes: any,
  label: Label,
  closeViewLabelView: Function,
  getLabelById: Function
}

interface State {
  name: string,
  description: string,
  label: string
}

class ViewLabelView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: this.props.label.name,
      description: this.props.label.description,
      label: this.props.label.labelId
    }
  }

  getLabelLabelName() {
    if (this.props.label.labelId === '') {
      return '';
    }

    let labelLabel = this.props.getLabelById(this.props.label.labelId);

    return labelLabel.name;
  }

  exit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();

    this.props.closeViewLabelView();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="h1" align="center">Label</Typography>

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
            defaultValue={this.getLabelLabelName()}
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

          <span>
            <Button className={classes.exitButton} variant="contained" color="primary" onClick={(e) => this.exit(e)}>
              <CancelIcon />
            </Button>
          </span>
        </FormGroup>
      </div>
    );
  }
}

export default withStyles(styles)(ViewLabelView);
