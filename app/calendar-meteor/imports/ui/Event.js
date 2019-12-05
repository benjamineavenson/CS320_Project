import React, { Component } from 'react';
import { deleteEvent } from './App.js';

export default class Event extends Component {

  handleDelete(){
    const id = this.props.id;
    deleteEvent(id);
    this._reactInternalFiber._debugOwner.stateNode.forceUpdate();
  }

  handleModify(){
    const id=this.props.id;
    this._reactInternalFiber._debugOwner.stateNode._reactInternalFiber._debugOwner.stateNode.setState({
      eventMod: id,
      page: 2,
    });
  }


  render() {
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
              <button className="ui button" onClick={this.handleModify.bind(this)}><i className="edit icon"></i>Modify Event</button>
              <button className="ui red button" onClick={this.handleDelete.bind(this)}><i className="close icon"></i>Delete Event</button>
            </div>
          </div>
        </div>
        </div>
    );
  }
}
