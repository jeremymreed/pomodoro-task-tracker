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
import electronSettings from 'electron-settings';
import { ipcRenderer } from 'electron';
import { withStyles } from '@material-ui/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = () => ({
  themeFormControl: {
    maxWidth: 150,
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

interface Props {
  classes: any,
  changeTheme: Function,
  closeEditSettingsView: Function
}

interface State {
  pomodoro: number,
  shortRest: number,
  longRest: number,
  intervalsInSet: number,
  shouldDisplaySeconds: boolean,
  databaseFileName: string,
  selectedTheme: string,
  timeLengthMin: number,
  timeLengthMax: number,
  intervalsInSetMin: number,
  intervalsInSetMax: number
}

class EditSettingsView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handlePomodoroSliderChange = this.handlePomodoroSliderChange.bind(this);
    this.handleShortRestSliderChange = this.handleShortRestSliderChange.bind(this);
    this.handleLongRestSliderChange = this.handleLongRestSliderChange.bind(this);
    this.handleIntervalsInSetSliderChange = this.handleIntervalsInSetSliderChange.bind(this);
    this.handleThemeSelectionChange = this.handleThemeSelectionChange.bind(this);

    this.state = {
      pomodoro: this.secondsToMinutes(electronSettings.getSync('pomodoro') as number),
      shortRest: this.secondsToMinutes(electronSettings.getSync('shortRest') as number),
      longRest: this.secondsToMinutes(electronSettings.getSync('longRest') as number),
      intervalsInSet: electronSettings.getSync('intervalsInSet') as number,
      shouldDisplaySeconds: electronSettings.getSync('shouldDisplaySeconds') as boolean,
      databaseFileName: electronSettings.getSync('databaseFileName') as string,
      selectedTheme: electronSettings.getSync('theme') as string,
      timeLengthMin: 1,
      timeLengthMax: 60,
      intervalsInSetMin: 1,
      intervalsInSetMax: 10
    }
  }

  secondsToMinutes(amount: number) {
    return Math.trunc(amount / 60);
  }

  minutesToSeconds(amount: number) {
    return amount * 60;
  }

  // TODO: Not sure what kind of event this is.
  handleLongRestChange(event: any) {
    const newLongRestChange = event.target.value;
    this.setState({longRest: newLongRestChange})
  }

  // TODO: Not sure what kind of event this is.
  handleIntervalsInSetChange(event: any) {
    const newIntervalsInSet = event.target.value;
    this.setState({intervalsInSet: newIntervalsInSet});
  }

  handleShouldDisplaySecondsChange() {
    this.setState({shouldDisplaySeconds: !this.state.shouldDisplaySeconds});
  }

  formSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();

    electronSettings.setSync({
      pomodoro: this.minutesToSeconds(this.state.pomodoro),
      shortRest: this.minutesToSeconds(this.state.shortRest),
      longRest: this.minutesToSeconds(this.state.longRest),
      intervalsInSet: this.state.intervalsInSet,
      shouldDisplaySeconds: this.state.shouldDisplaySeconds,
      databaseFileName: this.state.databaseFileName,
      theme: this.state.selectedTheme,
    });

    this.props.changeTheme(this.state.selectedTheme);

    ipcRenderer.send('showNotification', 'settingsUpdated');

    this.props.closeEditSettingsView();
  }

  cancelEdit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();

    this.props.closeEditSettingsView();
  }

  // TODO: Fix type name of this event.
  handlePomodoroSliderChange(event: any, value: any) {
    event.preventDefault();

    this.setState({pomodoro: value});
  }

  handleShortRestSliderChange(event: any, value: any) {
    event.preventDefault();

    this.setState({shortRest: value});
  }

  handleLongRestSliderChange(event: any, value: any) {
    event.preventDefault();

    this.setState({longRest: value});
  }

  handleIntervalsInSetSliderChange(event: any, value: any) {
    event.preventDefault();

    this.setState({intervalsInSet: value});
  }

  handleThemeSelectionChange(event: any) {
    event.preventDefault();

    this.setState({selectedTheme: event.target.value});
  }

  valueText(value: number) {
    return `${value}`
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="h1" align="center">
          Settings
        </Typography>

        <FormGroup>
          <Typography>
            Pomodoro Length (in minutes): {this.state.pomodoro}
          </Typography>
          <Slider defaultValue={this.state.pomodoro}
            getAriaValueText={this.valueText}
            aria-labelledby="discrete-slider-small-steps"
            step={1}
            marks={[{value: this.state.timeLengthMin, label: `${this.state.timeLengthMin}`}, {value: this.state.timeLengthMax, label: `${this.state.timeLengthMax}`}]}
            min={this.state.timeLengthMin}
            max={this.state.timeLengthMax}
            valueLabelDisplay="auto"
            onChangeCommitted={this.handlePomodoroSliderChange}
          />

          <Typography>
            Short Rest Length (in minutes): {this.state.shortRest}
          </Typography>
          <Slider defaultValue={this.state.shortRest}
            getAriaValueText={this.valueText}
            aria-labelledby="discrete-slider-small-steps"
            step={1}
            marks={[{value: this.state.timeLengthMin, label: `${this.state.timeLengthMin}`}, {value: this.state.timeLengthMax, label: `${this.state.timeLengthMax}`}]}
            min={this.state.timeLengthMin}
            max={this.state.timeLengthMax}
            valueLabelDisplay="auto"
            onChangeCommitted={this.handleShortRestSliderChange}
          />

          <Typography>
            Long Rest Length (in minutes): {this.state.longRest}
          </Typography>
          <Slider defaultValue={this.state.longRest}
            getAriaValueText={this.valueText}
            aria-labelledby="discrete-slider-small-steps"
            step={1}
            marks={[{value: this.state.timeLengthMin, label: `${this.state.timeLengthMin}`}, {value: this.state.timeLengthMax, label: `${this.state.timeLengthMax}`}]}
            min={this.state.timeLengthMin}
            max={this.state.timeLengthMax}
            valueLabelDisplay="auto"
            onChangeCommitted={this.handleLongRestSliderChange}
          />

          <Typography>
            How many Pomodoros before a long rest? {this.state.intervalsInSet}
          </Typography>
          <Slider defaultValue={this.state.intervalsInSet}
            getAriaValueText={this.valueText}
            aria-labelledby="discrete-slider-small-steps"
            step={1}
            marks={[{value: this.state.intervalsInSetMin, label: `${this.state.intervalsInSetMin}`}, {value: this.state.intervalsInSetMax, label: `${this.state.intervalsInSetMax}`}]}
            min={this.state.intervalsInSetMin}
            max={this.state.intervalsInSetMax}
            valueLabelDisplay="auto"
            onChangeCommitted={this.handleIntervalsInSetSliderChange}
          />

          <FormControlLabel
            control= {<Checkbox
              checked={ this.state.shouldDisplaySeconds }
              onChange={() => this.handleShouldDisplaySecondsChange()}
              color="primary"
              inputProps={{ 'aria-label': 'should display seconds checkbox' }}
            />}
            label="Display Seconds?"
          />

          <FormControl className={classes.themeFormControl} variant="outlined">
            <InputLabel>Theme</InputLabel>
            <Select
              label="Theme"
              value={this.state.selectedTheme}
              onChange={this.handleThemeSelectionChange}
            >
              <MenuItem value={'light'}>Light</MenuItem>
              <MenuItem value={'dark'}>Dark</MenuItem>
            </Select>

          </FormControl>

          <span>
            <Button className={classes.saveButton} variant="contained" color="primary" onClick={(e) => this.formSubmit(e)}>
              <SaveIcon />
            </Button>
            <Button className={classes.cancelButton} variant="contained" color="primary" onClick={(e) => this.cancelEdit(e)}>
              <CancelIcon />
            </Button>
          </span>
        </FormGroup>
      </div>
    );
  }
}

export default withStyles(styles)(EditSettingsView);