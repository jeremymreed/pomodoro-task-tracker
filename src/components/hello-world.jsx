import React from 'react';
import { Link } from '@reach/router';

class HelloWorld extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>💖 Hello World!</h1>
        <p>Welcome to your Electron application.</p>
        <Link to='test'>Go to Test View!</Link>
      </div>
    );
  }
}

export default HelloWorld;