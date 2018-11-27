import React from 'react';
import ReactDOM from 'react-dom';

class Root extends React.Component {
  render() {
    return (
      <div>
        233
      </div>
    );
  }
}

const element = document.getElementById('reactContainer');
ReactDOM.render(
  <Root />,
  element
);
