import React, { Component } from 'react';
import { events } from '../database.js';
import Event from './Event.js'

export default class Day extends Component {

  displayEvents(day) {
    let allEvents = events.find().fetch();
    let dayEvents = []
    for (let index = 0; index < allEvents.length; index++){
      if ((allEvents[index].startTime.getTime() > day.getTime()) &&
          (allEvents[index].endTime.getTime() < (day.getTime() + (1000*60*60*24)))){
        dayEvents.push(allEvents[index]);
      }
    }
    return dayEvents;
  }

  renderEvents(){
    const events = this.displayEvents(this.props.date);
    if(events.length === 0){
      return(
          <p>No Events are Scheduled for this day.</p>
      )
    }
    return events.map((event) => (
        <Event key={event._id} name={event.name} room={event.room} startTime={event.startTime} endTime={event.endTime}/>
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
