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
import Label from '../data-models/label';
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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const styles = (): any => ({
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
  labelName: {
    textDecoration: 'underline',
    textTransform: 'none'
  },
  labelActionButtons: {
    marginLeft: '5px',
    marginRight: '5px'
  },
  addLabelButton: {
    marginTop: '15px',
  }
});

interface Props {
  classes: any,
  labels: Array<Label>,
  openViewLabelView: Function,
  openEditLabelView: Function,
  openAddLabelView: Function,
  removeLabel: Function
}

class LabelList extends React.Component<Props>{
  constructor(props: Props) {
    super(props);
  }

  viewLabel(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, labelId: string) {
    event.preventDefault();

    this.props.openViewLabelView(labelId);
  }

  editLabel(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, labelId:string) {
    event.preventDefault();

    this.props.openEditLabelView(labelId);
  }

  removeLabel(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, labelId: string) {
    event.preventDefault();

    this.props.removeLabel(labelId);
  }

  addLabel(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();

    this.props.openAddLabelView();
  }

  getEmptyLabelList(classes: any) {
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

  getFullLabelList(classes: any) {
    // We have tasks.
    const listsLabels = this.props.labels.map((label) => {
      return (
        <TableRow key={ label._id }>
          <TableCell>
            <Container className={classes.labelNameContainer}>
              <Button className={ classes.taskButtons } size="small" onClick={(e) => this.viewLabel(e, label._id)}>
                <Typography className={ classes.labelName } variant="button" noWrap={true}>
                  { label.name }
                </Typography>
              </Button>
            </Container>
          </TableCell>
          <TableCell>
            <Button className={ classes.labelActionButtons } size="small" variant="contained" color="primary" onClick={(e) => this.editLabel(e, label._id)}>
              <EditIcon />
            </Button>
            <Button className={ classes.labelActionButtons } size="small" variant="contained" color="secondary" onClick={(e) => this.removeLabel(e, label._id)}>
              <DeleteIcon />
            </Button>
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

  getLabelList(classes: any) {
    if (this.props.labels.length === 0) {
      return (this.getEmptyLabelList(classes));
    } else {
      return (this.getFullLabelList(classes))
    }
  }

  render () {
    const { classes }: any = this.props;
    return (
      <div>
        { this.getLabelList(classes) }
        <Button className={classes.addLabelButton} variant="contained" color="primary" onClick={(e) => this.addLabel(e)}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(LabelList);