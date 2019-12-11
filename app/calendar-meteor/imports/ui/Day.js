import React, { Component } from 'react';
import Event from './Event.js';
import { displayEvents } from './App.js';

export default class Day extends Component {

  renderEvents() {  //get all of the events in the day from db and render the jsx for them
    const events = displayEvents(this.props.date);
    if (events.length === 0) {
      return (
        <p>No Events are Scheduled for this day.</p>
      );
    }
    return events.map((event) => (
      <Event key={event._id} buttons={1} id={event._id} name={event.name} room={event.room} startTime={event.startTime}
             endTime={event.endTime}/>
    ));
  }

  render() {  //render the page
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
