import React from 'react';
import PropTypes from 'prop-types';

class EditTask extends React.Component {
  constructor(props) {
    super(props);

    console.log('this.props.taskId', this.props.taskId);
  }

  render() {
    return (
      <div>
        <h1>Edit Task</h1>
      </div>
    )
  }
}

EditTask.propTypes = {
  taskId: PropTypes.string
};

export default EditTask;
