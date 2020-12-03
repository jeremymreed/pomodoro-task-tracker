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
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Label from "../data-models/label";
import StateVars from "../enums/state-vars-enum";

const styles = createStyles({
  divTable: {
    overflowY: "scroll",
    minWidth: 640,
    maxHeight: 425,
  },
  table: {
    minWidth: 640,
  },
  labelNameContainer: {
    maxWidth: 200,
  },
  labelName: {
    textDecoration: "underline",
    textTransform: "none",
  },
  labelActionButtons: {
    marginLeft: "5px",
    marginRight: "5px",
  },
  addLabelButton: {
    marginTop: "15px",
  },
  taskButtons: {
    marginLeft: "5px",
    marginRight: "5px",
  },
});

interface Props extends WithStyles<typeof styles> {
  labels: Array<Label>;
  appStateUpdate: (
    newState: StateVars,
    taskId: string,
    labelId: string
  ) => void;
  removeLabel: (labelId: string) => void;
}

function LabelList(props: Props) {
  const { classes } = props;

  const viewLabel = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    labelId: string
  ) => {
    const { appStateUpdate } = props;

    event.preventDefault();

    appStateUpdate(StateVars.ViewLabelState, "", labelId);
  };

  const editLabel = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    labelId: string
  ) => {
    const { appStateUpdate } = props;

    event.preventDefault();

    appStateUpdate(StateVars.EditLabelState, "", labelId);
  };

  const handleRemoveLabel = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    labelId: string
  ) => {
    const { removeLabel } = props;
    event.preventDefault();

    removeLabel(labelId);
  };

  const addLabel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { appStateUpdate } = props;

    event.preventDefault();

    appStateUpdate(StateVars.AddNewLabelState, "", "");
  };

  const getEmptyLabelList = () => {
    // No Labels.
    const listLabels = (
      <TableRow>
        <TableCell>
          <Typography variant="h6" align="center">
            You have no labels.
          </Typography>
        </TableCell>
      </TableRow>
    );

    return (
      <TableContainer className={classes.divTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>{listLabels}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getFullLabelList = () => {
    const { labels } = props;

    // We have tasks.
    const listsLabels = labels.map((label) => {
      return (
        <TableRow key={label._id}>
          <TableCell>
            <Container className={classes.labelNameContainer}>
              <Button
                className={classes.taskButtons}
                size="small"
                onClick={(e) => viewLabel(e, label._id)}
              >
                <Typography
                  className={classes.labelName}
                  variant="button"
                  noWrap
                >
                  {label.name}
                </Typography>
              </Button>
            </Container>
          </TableCell>
          <TableCell>
            <Button
              className={classes.labelActionButtons}
              size="small"
              variant="contained"
              color="primary"
              onClick={(e) => editLabel(e, label._id)}
            >
              <EditIcon />
            </Button>
            <Button
              className={classes.labelActionButtons}
              size="small"
              variant="contained"
              color="secondary"
              onClick={(e) => handleRemoveLabel(e, label._id)}
            >
              <DeleteIcon />
            </Button>
          </TableCell>
          <TableCell />
        </TableRow>
      );
    });

    return (
      <TableContainer component={Paper} className={classes.divTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Name</Typography>
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>{listsLabels}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getLabelList = () => {
    const { labels } = props;

    if (labels.length === 0) {
      return getEmptyLabelList();
    }

    return getFullLabelList();
  };

  return (
    <div>
      {getLabelList()}
      <Button
        className={classes.addLabelButton}
        variant="contained"
        color="primary"
        onClick={(e) => addLabel(e)}
      >
        <AddIcon />
      </Button>
    </div>
  );
}

export default withStyles(styles)(LabelList);
