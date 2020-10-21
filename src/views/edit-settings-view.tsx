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
import electronSettings from "electron-settings";
import { ipcRenderer } from "electron";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

const styles = () => ({
  themeFormControl: {
    maxWidth: 150,
  },
  saveButton: {
    marginTop: "5px",
    marginRight: "5px",
  },
  cancelButton: {
    marginTop: "5px",
    marginLeft: "5px",
  },
});

interface Props extends WithStyles<typeof styles> {
  changeTheme: (themeName: string) => void;
  closeEditSettingsView: () => void;
}

interface State {
  pomodoro: number;
  shortRest: number;
  longRest: number;
  intervalsInSet: number;
  shouldDisplaySeconds: boolean;
  databaseFileName: string;
  selectedTheme: string;
  timeLengthMin: number;
  timeLengthMax: number;
  intervalsInSetMin: number;
  intervalsInSetMax: number;
}

const secondsToMinutes = (amount: number) => {
  return Math.trunc(amount / 60);
};

const minutesToSeconds = (amount: number) => {
  return amount * 60;
};

const valueText = (value: number) => {
  return `${value}`;
};

class EditSettingsView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handlePomodoroSliderChange = this.handlePomodoroSliderChange.bind(
      this
    );
    this.handleShortRestSliderChange = this.handleShortRestSliderChange.bind(
      this
    );
    this.handleLongRestSliderChange = this.handleLongRestSliderChange.bind(
      this
    );
    this.handleIntervalsInSetSliderChange = this.handleIntervalsInSetSliderChange.bind(
      this
    );
    this.handleThemeSelectionChange = this.handleThemeSelectionChange.bind(
      this
    );

    this.state = {
      pomodoro: secondsToMinutes(
        electronSettings.getSync("pomodoro") as number
      ),
      shortRest: secondsToMinutes(
        electronSettings.getSync("shortRest") as number
      ),
      longRest: secondsToMinutes(
        electronSettings.getSync("longRest") as number
      ),
      intervalsInSet: electronSettings.getSync("intervalsInSet") as number,
      shouldDisplaySeconds: electronSettings.getSync(
        "shouldDisplaySeconds"
      ) as boolean,
      databaseFileName: electronSettings.getSync("databaseFileName") as string,
      selectedTheme: electronSettings.getSync("theme") as string,
      timeLengthMin: 1,
      timeLengthMax: 60,
      intervalsInSetMin: 1,
      intervalsInSetMax: 10,
    };
  }

  getShouldDisplaySecondsCheckbox() {
    const { shouldDisplaySeconds } = this.state;

    return (
      <Checkbox
        checked={shouldDisplaySeconds}
        onChange={() => this.handleShouldDisplaySecondsChange()}
        color="primary"
        inputProps={{ "aria-label": "should display seconds checkbox" }}
      />
    );
  }

  cancelEdit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { closeEditSettingsView } = this.props;

    event.preventDefault();

    closeEditSettingsView();
  }

  handleShouldDisplaySecondsChange() {
    const { shouldDisplaySeconds } = this.state;
    this.setState({ shouldDisplaySeconds: !shouldDisplaySeconds });
  }

  // TODO: Fix type name of this event.
  handlePomodoroSliderChange(
    event: React.ChangeEvent<unknown>,
    value: number | number[]
  ) {
    event.preventDefault();

    let sliderValue;

    if (Array.isArray(value)) {
      [sliderValue] = value;
    } else {
      sliderValue = value;
    }

    this.setState({ pomodoro: sliderValue });
  }

  handleShortRestSliderChange(
    event: React.ChangeEvent<unknown>,
    value: number | number[]
  ) {
    event.preventDefault();

    let sliderValue;

    if (Array.isArray(value)) {
      [sliderValue] = value;
    } else {
      sliderValue = value;
    }

    this.setState({ shortRest: sliderValue });
  }

  handleLongRestSliderChange(
    event: React.ChangeEvent<unknown>,
    value: number | number[]
  ) {
    event.preventDefault();

    let sliderValue;

    if (Array.isArray(value)) {
      [sliderValue] = value;
    } else {
      sliderValue = value;
    }

    this.setState({ longRest: sliderValue });
  }

  handleIntervalsInSetSliderChange(
    event: React.ChangeEvent<unknown>,
    value: number | number[]
  ) {
    event.preventDefault();

    let sliderValue;

    if (Array.isArray(value)) {
      [sliderValue] = value;
    } else {
      sliderValue = value;
    }

    this.setState({ intervalsInSet: sliderValue });
  }

  handleThemeSelectionChange(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    event.preventDefault();

    if (typeof event.target.value === "string") {
      this.setState({ selectedTheme: event.target.value });
    } else {
      throw new Error("handleThemeSelectionChange: value is not a string!");
    }
  }

  formSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { changeTheme, closeEditSettingsView } = this.props;

    const {
      pomodoro,
      shortRest,
      longRest,
      intervalsInSet,
      shouldDisplaySeconds,
      databaseFileName,
      selectedTheme,
    } = this.state;

    event.preventDefault();

    electronSettings.setSync({
      pomodoro: minutesToSeconds(pomodoro),
      shortRest: minutesToSeconds(shortRest),
      longRest: minutesToSeconds(longRest),
      intervalsInSet,
      shouldDisplaySeconds,
      databaseFileName,
      theme: selectedTheme,
    });

    changeTheme(selectedTheme);

    ipcRenderer.send("showNotification", "settingsUpdated");

    closeEditSettingsView();
  }

  render() {
    const { classes } = this.props;

    const {
      pomodoro,
      timeLengthMin,
      timeLengthMax,
      shortRest,
      longRest,
      intervalsInSet,
      intervalsInSetMax,
      intervalsInSetMin,
      selectedTheme,
    } = this.state;

    return (
      <div>
        <Typography variant="h1" align="center">
          Settings
        </Typography>

        <FormGroup>
          {/* Resolving conflict between eslint and prettier here */}
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <Typography>Pomodoro Length (in minutes): {pomodoro}</Typography>
          <Slider
            defaultValue={pomodoro}
            getAriaValueText={valueText}
            aria-labelledby="discrete-slider-small-steps"
            step={1}
            marks={[
              {
                value: timeLengthMin,
                label: `${timeLengthMin}`,
              },
              {
                value: timeLengthMax,
                label: `${timeLengthMax}`,
              },
            ]}
            min={timeLengthMin}
            max={timeLengthMax}
            valueLabelDisplay="auto"
            onChangeCommitted={this.handlePomodoroSliderChange}
          />

          {/* Resolving conflict between eslint and prettier here */}
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <Typography>Short Rest Length (in minutes): {shortRest}</Typography>
          <Slider
            defaultValue={shortRest}
            getAriaValueText={valueText}
            aria-labelledby="discrete-slider-small-steps"
            step={1}
            marks={[
              {
                value: timeLengthMin,
                label: `${timeLengthMin}`,
              },
              {
                value: timeLengthMax,
                label: `${timeLengthMax}`,
              },
            ]}
            min={timeLengthMin}
            max={timeLengthMax}
            valueLabelDisplay="auto"
            onChangeCommitted={this.handleShortRestSliderChange}
          />

          {/* Resolving conflict between eslint and prettier here */}
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <Typography>Long Rest Length (in minutes): {longRest}</Typography>
          <Slider
            defaultValue={longRest}
            getAriaValueText={valueText}
            aria-labelledby="discrete-slider-small-steps"
            step={1}
            marks={[
              {
                value: timeLengthMin,
                label: `${timeLengthMin}`,
              },
              {
                value: timeLengthMax,
                label: `${timeLengthMax}`,
              },
            ]}
            min={timeLengthMin}
            max={timeLengthMax}
            valueLabelDisplay="auto"
            onChangeCommitted={this.handleLongRestSliderChange}
          />

          <Typography>
            How many Pomodoros before a long rest?
            {intervalsInSet}
          </Typography>
          <Slider
            defaultValue={intervalsInSet}
            getAriaValueText={valueText}
            aria-labelledby="discrete-slider-small-steps"
            step={1}
            marks={[
              {
                value: intervalsInSetMin,
                label: `${intervalsInSetMin}`,
              },
              {
                value: intervalsInSetMax,
                label: `${intervalsInSetMax}`,
              },
            ]}
            min={intervalsInSetMin}
            max={intervalsInSetMax}
            valueLabelDisplay="auto"
            onChangeCommitted={this.handleIntervalsInSetSliderChange}
          />

          <FormControlLabel
            control={this.getShouldDisplaySecondsCheckbox()}
            label="Display Seconds?"
          />

          <FormControl className={classes.themeFormControl} variant="outlined">
            <InputLabel>Theme</InputLabel>
            <Select
              label="Theme"
              value={selectedTheme}
              onChange={this.handleThemeSelectionChange}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>

          <span>
            <Button
              className={classes.saveButton}
              variant="contained"
              color="primary"
              onClick={(e) => this.formSubmit(e)}
            >
              <SaveIcon />
            </Button>
            <Button
              className={classes.cancelButton}
              variant="contained"
              color="primary"
              onClick={(e) => this.cancelEdit(e)}
            >
              <CancelIcon />
            </Button>
          </span>
        </FormGroup>
      </div>
    );
  }
}

export default withStyles(styles)(EditSettingsView);
