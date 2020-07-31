import React from 'react';
import electronSettings from 'electron-settings';
import PropTypes from 'prop-types';

class EditSettingsView extends React.Component {
  constructor(props) {
    super(props);

    this.handlePomodoroChange = this.handlePomodoroChange.bind(this);
    this.handleShortRestChange = this.handleShortRestChange.bind(this);
    this.handleLongRestChange = this.handleLongRestChange.bind(this);
    this.handleIntervalsInSetChange = this.handleIntervalsInSetChange.bind(this);
   
    this.state = {
      pomodoro: electronSettings.getSync('pomodoro'),
      shortRest: electronSettings.getSync('shortRest'),
      longRest: electronSettings.getSync('longRest'),
      intervalsInSet: electronSettings.getSync('intervalsInSet')
    }
  }

  handlePomodoroChange(event) {
    const newPomodoro = event.target.value;
    this.setState({pomodoro: newPomodoro});
  }

  handleShortRestChange(event) {
    const newShortRest = event.target.value;
    this.setState({shortRest: newShortRest});
  }

  handleLongRestChange(event) {
    const newLongRestChange = event.target.value;
    this.setState({longRest: newLongRestChange})
  }

  handleIntervalsInSetChange(event) {
    const newIntervalsInSet = event.target.value;
    this.setState({intervalsInSet: newIntervalsInSet});
  }

  formSubmit(event) {
    event.preventDefault();

    electronSettings.setSync({
      pomodoro: this.state.pomodoro,
      shortRest: this.state.shortRest,
      longRest: this.state.longRest,
      intervalsInSet: this.state.intervalsInSet
    });

    this.props.closeEditSettingsView();
  }

  cancelEdit(event) {
    event.preventDefault();

    this.props.closeEditSettingsView();
  }

  render() {
    return (
      <div>
        <h1>Task Editor</h1>
        <form onSubmit={(event) => this.formSubmit(event)}>
          <p>
            <label>
              Pomodoro Length (in minutes):
              <input type="text" value={this.state.pomodoro} onChange={(event) => this.handlePomodoroChange(event)} />
            </label>
          </p>

          <p>
            <label>
              Short Rest Length (in minutes):
              <input type="text" value={this.state.shortRest} onChange={(event) => this.handleShortRestChange(event)} />
            </label>
          </p>

          <p>
            <label>
              Long Rest Length (in minutes):
              <input type="text" value={this.state.longRest} onChange={(event) => this.handleLongRestChange(event)} />
            </label>
          </p>

          <p>
            <label>
              How many Pomodoros before a long rest?
              <input type="text" value={this.state.intervalsInSet} onChange={(event) => this.handleIntervalsInSetChange(event)} />
            </label>
          </p>

          <p>
            <input type="submit" value="Submit"></input>
            <button onClick={(e) => this.cancelEdit(e)}>Cancel</button>
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
