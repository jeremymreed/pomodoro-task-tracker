import React from 'react';
import { Router, Link } from '@reach/router';
import HelloWorld from './hello-world';
import Test from './test';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Router>
          <HelloWorld path='/' />
          <Test path='test' />
          <NotFound default />
        </Router>
      </div>
    );
  }
}

function NotFound () {
  return (
    <div>
      <p>Nothing to see here!</p>
      <Link to='/'>Go back!</Link>
    </div>
  )
}

export default App;
