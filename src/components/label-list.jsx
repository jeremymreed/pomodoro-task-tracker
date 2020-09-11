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
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  divTable: {
    overflowY: 'scroll',
    minWidth: 640,
    maxHeight: 425
  },
  table: {
    minWidth: 640,
  },
  labelNameContainer: {
    maxWidth: 200,
  },
  labelActionButtonGroup: {
    marginLeft: '5px',
    marginRight: '5px'
  },
  addLabelButton: {
    marginTop: '15px',
  }
});

class LabelList extends React.Component {
  constructor(props) {
    super(props);
  }

  viewLabel(event, labelId) {
    event.preventDefault();

    this.props.openViewLabelView(labelId);
  }

  editLabel(event, labelId) {
    event.preventDefault();

    this.props.openEditLabelView(labelId);
  }

  removeLabel(event, labelId) {
    event.preventDefault();

    this.props.removeLabel(labelId);
  }

  addLabel(event) {
    event.preventDefault();

    this.props.openAddLabelView();
  }

  getEmptyLabelList(classes) {
    // No Labels.
    const listLabels= (
      <TableRow>
        <TableCell>
          <Typography variant="h6" align="center">You have no labels.</Typography>
        </TableCell>
      </TableRow>
    );

    return (
      <TableContainer className={classes.divTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { listLabels }
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  getFullLabelList(classes) {
    // We have tasks.
    const listsLabels = this.props.labels.map((label) => {
      return (
        <TableRow key={ label._id }>
          <TableCell>
            <Container className={classes.labelNameContainer}>
              <Typography noWrap={true}>{ label.name }</Typography>
            </Container>
          </TableCell>
          <TableCell>
            <Button size="small" variant="contained" color="primary" onClick={(e) => this.viewLabel(e, label._id)}>View</Button>
            <Button size="small" variant="contained" color="primary" onClick={(e) => this.editLabel(e, label._id)}>Edit</Button>
            <Button size="small" variant="contained" color="secondary" onClick={(e) => this.removeLabel(e, label._id)}>Remove</Button>
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      );
    });

    return (
      <TableContainer component={Paper} className={classes.divTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6">Name</Typography></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { listsLabels }
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  getLabelList(classes) {
    if (this.props.labels.length === 0) {
      return (this.getEmptyLabelList(classes));
    } else {
      return (this.getFullLabelList(classes))
    }
  }

  render () {
    const { classes } = this.props;
    return (
      <div>
        { this.getLabelList(classes) }
        <Button className={classes.addLabelButton} variant="contained" color="primary" onClick={(e) => this.addLabel(e)}>Add new label</Button>
      </div>
    );
  }
}

LabelList.propTypes = {
  classes: PropTypes.object,
  labels: PropTypes.array,
  openViewLabelView: PropTypes.func,
  openEditLabelView: PropTypes.func,
  openAddLabelView: PropTypes.func,
  removeLabel: PropTypes.func
};

export default withStyles(styles)(LabelList);
