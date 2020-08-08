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
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class EditSettingsView extends React.Component {
  constructor(props) {
    super(props);

    this.handlePomodoroSliderChange = this.handlePomodoroSliderChange.bind(this);
    this.handleShortRestSliderChange = this.handleShortRestSliderChange.bind(this);
    this.handleLongRestSliderChange = this.handleLongRestSliderChange.bind(this);
    this.handleIntervalsInSetSliderChange = this.handleIntervalsInSetSliderChange.bind(this);

    this.state = {
      pomodoro: this.secondsToMinutes(electronSettings.getSync('pomodoro')),
      shortRest: this.secondsToMinutes(electronSettings.getSync('shortRest')),
      longRest: this.secondsToMinutes(electronSettings.getSync('longRest')),
      intervalsInSet: electronSettings.getSync('intervalsInSet'),
      shouldDisplaySeconds: electronSettings.getSync('shouldDisplaySeconds'),
      timeLengthMin: 1,
      timeLengthMax: 60,
      intervalsInSetMin: 1,
      intervalsInSetMax: 10
    }
  }

  secondsToMinutes(amount) {
    return Math.trunc(amount / 60);
  }

  minutesToSeconds(amount) {
    return amount * 60;
  }

  handleLongRestChange(event) {
    const newLongRestChange = event.target.value;
    this.setState({longRest: newLongRestChange})
  }

  handleIntervalsInSetChange(event) {
    const newIntervalsInSet = event.target.value;
    this.setState({intervalsInSet: newIntervalsInSet});
  }

  handleShouldDisplaySecondsChange() {
    this.setState({shouldDisplaySeconds: !this.state.shouldDisplaySeconds});
  }

  formSubmit(event) {
    event.preventDefault();

    electronSettings.setSync({
      pomodoro: this.minutesToSeconds(this.state.pomodoro),
      shortRest: this.minutesToSeconds(this.state.shortRest),
      longRest: this.minutesToSeconds(this.state.longRest),
      intervalsInSet: this.state.intervalsInSet,
      shouldDisplaySeconds: this.state.shouldDisplaySeconds
    });

    ipcRenderer.send('showNotification', 'settingsUpdated');

    this.props.closeEditSettingsView();
  }

  cancelEdit(event) {
    event.preventDefault();

    this.props.closeEditSettingsView();
  }

  handlePomodoroSliderChange(event, value) {
    event.preventDefault();

    this.setState({pomodoro: value});
  }

  handleShortRestSliderChange(event, value) {
    event.preventDefault();

    this.setState({shortRest: value});
  }

  handleLongRestSliderChange(event, value) {
    event.preventDefault();

    this.setState({longRest: value});
  }

  handleIntervalsInSetSliderChange(event, value) {
    event.preventDefault();

    this.setState({intervalsInSet: value});
  }

  valueText(value) {
    return `${value}`
  }

  render() {
    return (
      <div>
        <Typography variant="h1">
          Settings
        </Typography>
        <form onSubmit={(event) => this.formSubmit(event)}>
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

          <div>
            <label>
              <FormControlLabel
                control= {<Checkbox
                  checked={ this.state.shouldDisplaySeconds }
                  onChange={() => this.handleShouldDisplaySecondsChange()}
                  color="primary"
                  inputProps={{ 'aria-label': 'should display seconds checkbox' }}
                />}
                label="Display Seconds?"
              />
            </label>
          </div>

          <p>
            <input type="submit" value="Save"></input>
            <Button variant="contained" color="primary" onClick={(e) => this.cancelEdit(e)}>Cancel</Button>
          </p>
        </form>
      </div>
    );
  }
}

EditSettingsView.propTypes = {
  closeEditSettingsView: PropTypes.func
}

export default EditSettingsView;
