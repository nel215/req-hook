import React from 'react';
import ReactDOM from 'react-dom';
import {EventEmitter2 as EventEmitter} from 'eventemitter2';

class FilterStore extends EventEmitter {
  constructor() {
    super();
    this.filters = [];
  }
  fetchAll() {
    this.emit('fetched');
  }
  add(url) {
    this.filters.push(url);
    this.emit('added');
  }
  get() {
    return this.filters;
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
    this.setState({filters: filterStore.get()});
  },
  addUrl: function() {
    filterStore.add('http://test/*');
  },
  componentDidMount: function() {
    filterStore.on('fetched', this.updateFilter);
    filterStore.on('added', this.updateFilter);
    filterStore.fetchAll();
  },
  componentWillUnmount: function() {
    filterStore.off('fetched', this.updateFilter);
    filterStore.on('added', this.updateFilter);
  },
  render: function() {
    var urls = this.state.filters.map((url)=> {
      return <p>{url}</p>
    });
    return (
      <div style={{height: '160px', width: '320px'}}>
        <button onClick={this.addUrl}>add</button>
        {urls}
      </div>
    );
  }
});

ReactDOM.render(
    <Filter />,
    document.getElementById('content')
);

