import React from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';

class EditTaskView extends React.Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);

    this.state = {
      id: this.props.task._id,
      name: this.props.task._name,
      description: this.props.task._description
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

  formSubmit(event) {
    event.preventDefault();

    ipcRenderer.send('submitTaskData', { _id: this.state.id, _name: this.state.name, _description: this.state.description });
    this.props.closeEditTaskView();
  }

  render() {
    return (
      <div>
        <h1>Task Editor</h1>
        <form onSubmit={(event) => this.formSubmit(event)}>
          <p>
            <label>
              Name:
              <input type="text" value={this.state.name} onChange={(event) => this.handleNameChange(event)} />
            </label>
          </p>

          <p>
            <label>
              Description:
              <input type="text" value={this.state.description} onChange={(event) => this.handleDescriptionChange(event)} />
            </label>
          </p>

          <p>
            <input type="submit" value="Submit"></input>
          </p>
        </form>
      </div>
    );
  }
}

EditTaskView.propTypes = {
  task: PropTypes.object,
  closeEditTaskView: PropTypes.func
}

export default EditTaskView;
