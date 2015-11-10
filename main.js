import React from 'react';
import ReactDOM from 'react-dom';
import {EventEmitter2 as EventEmitter} from 'eventemitter2';

class Store extends EventEmitter {
  constructor() {
    super();
    this.filters = [];
    this.target = '';
  }
  fetchTarget() {
    chrome.storage.sync.get('target', (items)=> {
      this.target = items.target || '';
      this.emit('target:fetched');
    });
  }
  changeTarget(target) {
    this.target = target;
    chrome.storage.sync.set({target: target}, ()=> {
      this.emit('target:changed');
    });
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
  getTarget(){
    return this.target;
  }
  get() {
    return this.filters;
  }
};

var store = new Store();

var Filter = React.createClass({
  getInitialState: function() {
    return {
      targetChanged: '',
      url: '',
      filters: ['http://*/*']
    };
  },
  targetChanged: function(e) {
    store.changeTarget(e.target.value);
  },
  urlChanged: function(e) {
    this.setState({url: e.target.value});
  },
  updateFilter: function() {
    this.setState({filters: store.get()});
  },
  updateTarget: function() {
    this.setState({target: store.getTarget()});
  },
  addUrl: function() {
    store.add(this.state.url);
  },
  deleteUrl: function(idx) {
    store.delete(idx);
  },
  componentDidMount: function() {
    store.on('fetched', this.updateFilter);
    store.on('added', this.updateFilter);
    store.on('deleted', this.updateFilter);
    store.on('target:fetched', this.updateTarget);
    store.on('target:changed', this.updateTarget);
    store.fetchAll();
    store.fetchTarget();
  },
  componentWillUnmount: function() {
    store.off('fetched', this.updateFilter);
    store.off('added', this.updateFilter);
    store.off('deleted', this.updateFilter);
    store.off('target:fetched', this.updateTarget);
    store.off('target:changed', this.updateTarget);
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
          <h1>keywords</h1>
          <div>
            <input type='text' value={this.state.url} onChange={this.urlChanged}></input>
            <button onClick={this.addUrl}>add</button>
          </div>
          {urls}
        </div>
        <div>
          <h1>hook target</h1>
          <input type='text' value={this.state.target} onChange={this.targetChanged}></input>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
    <Filter />,
    document.getElementById('content')
);

