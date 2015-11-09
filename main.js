import React from 'react';
import ReactDOM from 'react-dom';

var Filter = React.createClass({
  getInitialState: function() {
    return {
      filters: ['http://*/*']
    };
  },
  render: function() {
    var urls = this.state.filters.map((url)=> {
      return <p>{url}</p>
    });
    return (
      <div style={{height: '160px', width: '320px'}}>
        {urls}
      </div>
    );
  }
});

ReactDOM.render(
    <Filter />,
    document.getElementById('content')
);

