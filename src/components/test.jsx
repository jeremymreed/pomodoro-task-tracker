import React from 'react';
import { Link } from  '@reach/router';

class Test extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Testing!</h1>
        <Link to='/'>Go to Hello World!</Link>
      </div>
    );
  }
}

export default Test;