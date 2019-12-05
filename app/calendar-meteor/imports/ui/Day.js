import React, { Component } from 'react';
import Event from './Event.js'
import { displayEvents } from './App.js';

export default class Day extends Component {

  renderEvents(){
    const events = displayEvents(this.props.date);
    if(events.length === 0){
      return(
          <p>No Events are Scheduled for this day.</p>
      )
    }
    return events.map((event) => (
        <Event key={event._id} id={event._id} name={event.name} room={event.room} startTime={event.startTime} endTime={event.endTime}/>
    ))
  }

  render() {
    return (
        <div className="sixteen wide column">
          <div className="date-header">{this.props.date.toDateString()}</div>
          <div className="ui grid">
            {this.renderEvents()}
            </div>
          </div>
    );
  }
}
