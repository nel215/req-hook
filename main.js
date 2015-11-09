import React from 'react';
import ReactDOM from 'react-dom';
import {EventEmitter2 as EventEmitter} from 'eventemitter2';

class FilterStore extends EventEmitter {
  constructor() {
    super();
    this.callbacks = [];
  }
  fetchAll() {
    this.emit('fetched');
  }
};

var filterStore = new FilterStore();

var Filter = React.createClass({
  getInitialState: function() {
    return {
      filters: ['http://*/*']
    };
  },
  updateFilter: function() {
    this.setState({filters: ['http://test/*']});
  },
  componentDidMount: function() {
    filterStore.on('fetched', this.updateFilter);
    filterStore.fetchAll();
  },
  componentWillUnmount: function() {
    filterStore.off('fetched', this.updateFilter);
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

