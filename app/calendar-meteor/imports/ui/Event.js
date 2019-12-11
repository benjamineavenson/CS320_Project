import React, { Component } from 'react';
import { deleteEvent } from './App.js';
import { modifyEventFetch } from './App.js';

export default class Event extends Component {

  handleDelete() {  //get the event we want to delete and delete it
    const id = this.props.id;
    const event = modifyEventFetch(id);
    const name = event.name;
    if (confirm('Are you sure you wish to delete ' + name + '?')) {
      deleteEvent(id);
      this._reactInternalFiber._debugOwner.stateNode.forceUpdate(); //update the parent component, in this case Day
    }
  }

  handleModify() {  //move to the add/modify page and put the event we want to modify in the eventMod field
    const id = this.props.id;
    this._reactInternalFiber._debugOwner.stateNode._reactInternalFiber._debugOwner.stateNode.setState({ //the parent of the parent, in this case App
      eventMod: modifyEventFetch(id),
      page: 2,
    });
  }

  renderButtons() { //this is not necessary... I wrote it when exploring a different way of handling event modification and it ended up in master
    if (this.props.buttons === 0) { //i am too lazy to get rid of it now, so it stays
      return ('');
    }
    return (<div>
      <button className="ui button" onClick={this.handleModify.bind(this)}><i className="edit icon"></i>Modify Event
      </button>
      <button className="ui red button" onClick={this.handleDelete.bind(this)}><i className="close icon"></i>Delete
        Event
      </button>
    </div>);
  }

  render() {  //render the event
    return (
      <div className="eight wide column">
        <div className="ui fluid card">
          <div className="header">{this.props.name}</div>
          <div className="ui grid">
            <div className="six wide column">
              <p className="align-right">Start Time:</p>
              <p className="align-right">End Time:</p>
              <p className="align-right">Room:</p>
            </div>
            <div className="five wide column">
              <p>{this.props.startTime.toLocaleTimeString('en-US')}</p>
              <p>{this.props.endTime.toLocaleTimeString('en-US')}</p>
              <p>{this.props.room}</p>
            </div>
            <div className="column">
              {this.renderButtons()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
