import React from 'react';
import ReactDOM from 'react-dom';
import {EventEmitter2 as EventEmitter} from 'eventemitter2';

class FilterStore extends EventEmitter {
  constructor() {
    super();
    this.filters = [];
  }
  fetchAll() {
    chrome.storage.sync.get('filters', (items)=> {
      this.filters = items.filters || [];
      this.emit('fetched');
    });
  }
  add(url) {
    chrome.storage.sync.get('filters', (items)=> {
      this.filters = items.filters || [];
      this.filters.push(url);
      chrome.storage.sync.set({filters: this.filters}, ()=> {
        this.emit('added');
      });
    });
  }
  delete(idx) {
    chrome.storage.sync.get('filters', (items)=> {
      this.filters = items.filters || [];
      this.filters.splice(idx, 1);
      chrome.storage.sync.set({filters: this.filters}, ()=> {
        this.emit('deleted');
      });
    });
  }
  get() {
    return this.filters;
  }
};

var filterStore = new FilterStore();

var Filter = React.createClass({
  getInitialState: function() {
    return {
      url: '',
      filters: ['http://*/*']
    };
  },
  urlChanged: function(e) {
    this.setState({url: e.target.value});
  },
  updateFilter: function() {
    this.setState({filters: filterStore.get()});
  },
  addUrl: function() {
    filterStore.add(this.state.url);
  },
  deleteUrl: function(idx) {
    filterStore.delete(idx);
  },
  componentDidMount: function() {
    filterStore.on('fetched', this.updateFilter);
    filterStore.on('added', this.updateFilter);
    filterStore.on('deleted', this.updateFilter);
    filterStore.fetchAll();
  },
  componentWillUnmount: function() {
    filterStore.off('fetched', this.updateFilter);
    filterStore.on('added', this.updateFilter);
    filterStore.off('deleted', this.updateFilter);
  },
  render: function() {
    var urls = this.state.filters.map((url, idx)=> {
      return (
        <div key={idx}>
          {url}
          <button onClick={this.deleteUrl.bind(this, idx)}>x</button>
        </div>
      );
    });
    return (
      <div style={{height: '160px', width: '320px'}}>
        <div>
          <input type='text' value={this.state.url} onChange={this.urlChanged}></input>
          <button onClick={this.addUrl}>add</button>
        </div>
        {urls}
      </div>
    );
  }
});

ReactDOM.render(
    <Filter />,
    document.getElementById('content')
);

