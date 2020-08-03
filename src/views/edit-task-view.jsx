import React from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';

class EditTaskView extends React.Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleDoneChange = this.handleDoneChange.bind(this);

    console.log('this.props.task', this.props.task);

    this.state = {
      name: this.props.task.name,
      description: this.props.task.description,
      done: this.props.task.done
    }
  }

  handleNameChange(event) {
    const newName = event.target.value;
    this.setState({name: newName});
  }

  handleDescriptionChange(event) {
    const newDescription = event.target.value;
    this.setState({description: newDescription});
  }

  handleDoneChange() {
    this.setState({done: !this.state.done});
  }

  formSubmit(event) {
    event.preventDefault();

    this.props.editTask(this.state.name, this.state.description, this.state.done);
    ipcRenderer.send('showNotification', 'taskUpdated');
    this.props.closeEditTaskView();
  }

  cancelEdit(event) {
    event.preventDefault();

    this.props.closeEditTaskView();
  }

  render() {
    return (
      <div>
        <h1>Task Editor</h1>
        <form onSubmit={(event) => this.formSubmit(event)}>
          <div>
            <label>
              Name:
              <input type="text" value={this.state.name} onChange={(event) => this.handleNameChange(event)} />
            </label>
          </div>

          <div>
            <label>
              <p>Description:</p>
              <textarea className="description-textarea" value={this.state.description} onChange={(event) => this.handleDescriptionChange(event)} />
            </label>
          </div>

          <div>
            <label>
              Done:
              <input type="checkbox" value={ this.state.done } checked={ this.state.done } onChange={() => this.handleDoneChange()}/>
            </label>
          </div>

          <div>
            <input type="submit" value="Submit"></input>
            <button onClick={(e) => this.cancelEdit(e)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

EditTaskView.propTypes = {
  task: PropTypes.object,
  editTask: PropTypes.func,
  closeEditTaskView: PropTypes.func
}

export default EditTaskView;
