import React from 'react';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { events } from '../database.js';
import { users } from '../database.js';
import Day from './Day.js'

export default class App extends Component{
  constructor(props){
    super(props);

    let start = new Date(Date.now());
    start.setHours(0,0,0,0);
    let end = new Date(Date.now());
    end.setHours(0,0,0,0);

    this.state = {
      page: 0,
      user: null,
      startDay: start,
      endDay: end,
      eventMod: null,
    };
  }

  handlePageChange(pageNum){
    this.setState({page: pageNum});
  }

  handleLogin(){
    const username = ReactDOM.findDOMNode(this.refs.userInput).value.trim();
    const password = ReactDOM.findDOMNode(this.refs.pwInput).value.trim();

    let user = getUser(username);
    if(user === null){
      return;
    }
    if(user.password === password){
      this.setState({
        user: user,
      });
      this.handlePageChange(1);
    }
  }

  handleLogout(){
    let start = new Date(Date.now());
    start.setHours(0,0,0,0);
    let end = new Date(Date.now());
    end.setHours(0,0,0,0);
    this.setState({
      user: null,
      startDay: start,
      endDay: end,
    })
    this.handlePageChange(0);
  }

  handleRegister(){
    const username = ReactDOM.findDOMNode(this.refs.newUser).value.trim();
    const password = ReactDOM.findDOMNode(this.refs.newPassword).value.trim();
    const confirm = ReactDOM.findDOMNode(this.refs.confirmNewPassword).value.trim();

    if(password === confirm){
      addUser(username, password);
      this.handlePageChange(0);
    }
  }

  handleChangePassword(){
    const old = ReactDOM.findDOMNode(this.refs.oldPassword).value.trim();
    const myNew = ReactDOM.findDOMNode(this.refs.changePassword).value.trim();
    const confirm = ReactDOM.findDOMNode(this.refs.changePasswordConfirm).value.trim();

    const user = getUser(this.state.user.username);
    if(old === user.password && myNew === confirm){
      console.log("we made it");
      updateUser({
        username: user.username,
        password: myNew,
      },
          user._id);
    }
  }

  handleDisplayChange(){
    const startMonth = ReactDOM.findDOMNode(this.refs.displayStartMonth).value.trim();
    const startDay = ReactDOM.findDOMNode(this.refs.displayStartDay).value.trim();
    const startYear = ReactDOM.findDOMNode(this.refs.displayStartYear).value.trim();
    const endMonth = ReactDOM.findDOMNode(this.refs.displayEndMonth).value.trim();
    const endDay = ReactDOM.findDOMNode(this.refs.displayEndDay).value.trim();
    const endYear = ReactDOM.findDOMNode(this.refs.displayEndYear).value.trim();

    this.setState({
      startDay: new Date(startYear, startMonth, startDay),
      endDay: new Date(endYear, endMonth, endDay),
    });


  }

  handleNewEvent(){
    const eventName = ReactDOM.findDOMNode(this.refs.eventName).value.trim();
    const eventRoom = ReactDOM.findDOMNode(this.refs.eventRoom).value.trim();

    const eventMonth = ReactDOM.findDOMNode(this.refs.eventDateMonth).value.trim();
    const eventDay = ReactDOM.findDOMNode(this.refs.eventDateDay).value.trim();
    const eventYear = ReactDOM.findDOMNode(this.refs.eventDateYear).value.trim();
    let eventStartHour = ReactDOM.findDOMNode(this.refs.eventStartHour).value.trim();
    const eventStartMinute = ReactDOM.findDOMNode(this.refs.eventStartMinute).value.trim();
    const eventStartPM = ReactDOM.findDOMNode(this.refs.eventStartPM).value.trim();
    let eventEndHour = ReactDOM.findDOMNode(this.refs.eventEndHour).value.trim();
    const eventEndMinute = ReactDOM.findDOMNode(this.refs.eventEndMinute).value.trim();
    const eventEndPM = ReactDOM.findDOMNode(this.refs.eventEndPM).value.trim();

    if((eventStartHour === '12') && (eventStartPM === '0')){
      eventStartHour = 0;
    }else if(eventStartPM === '1'){
      eventStartHour += '12';
    }
    if((eventEndHour === '12') && (eventEndPM === '0')){
      eventEndHour = 0;
    }else if(eventEndPM === '1'){
      eventEndHour += 12;
    }

    const startDate = new Date(eventYear, eventMonth, eventDay, eventStartHour, eventStartMinute);
    const endDate = new Date(eventYear, eventMonth, eventDay, eventEndHour, eventEndMinute);

    createEvent(eventName, startDate, endDate, eventRoom, this.state.user.username);
    this.handlePageChange(1);
  }


  renderDays(){
    const days = this.getDaysBetween(this.state.startDay, this.state.endDay);
    return days.map((day) => (
        <Day key={day.getTime()} date={day}/>
    ));
  }

  getDaysBetween(start, end){
    let output = [];
    output.push(start);
    let nextDay = new Date(start.getTime() + 1000*60*60*24);
    while(nextDay.getTime() < end.getTime()){
      output.push(nextDay);
      nextDay = new Date(nextDay.getTime() + 1000*60*60*24);
      console.log("nextDay: "+nextDay);
    }
    if(end.getTime() > start.getTime()){
      output.push(end);
    }
    return(output);
  }

  render(){
    switch(this.state.page){
      case 0: //login/index page
        return(
            <div className="ui form container">
              <div className="login header">Login</div>
              <label>User Name:</label>
              <input ref="userInput" placeholder="User Name"/>
              <div className="row">
                <label>Password:</label>
                <input ref="pwInput" placeholder="Password"/>
              </div>
              <div className="ui two column grid">
                <div className="column" align="left">
                  <button style={{height: 40 + 'px'}} onClick={this.handlePageChange.bind(this, 4)}>New User</button>
                </div>
                <div className="column" align="right">
                  <button style={{height: 40 + 'px'}} onClick={this.handleLogin.bind(this)}>Login</button>
                </div>
              </div>
            </div>
        );
      case 1: //display page
        return(
            <div id="pagewrapper" className="ui container">
              <div className="ui top attached menu">
                <a className="item" onClick={this.handlePageChange.bind(this, 2)}><i className="calendar plus icon"></i> New Event</a>
                <a className="item" onClick={this.handlePageChange.bind(this, 3)}><i className="user icon"></i> User Profile</a>
                <div className="ui right menu">
                  <a className="item" onClick={this.handleLogout.bind(this)}><i className="logout icon"></i> Logout</a>
                </div>
              </div>
              <div className="ui grid">
                <div id="date-select" className="sixteen wide column">
                  <p>Display Events</p>
                  From
                  <select ref="displayStartMonth" className="ui dropdown">
                    <option value="">Month</option>
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9">October</option>
                    <option value="10">November</option>
                    <option value="11">December</option>
                  </select>
                  <select ref="displayStartDay" className="ui dropdown">
                    <option value="">Day</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                  </select>
                  <div className="ui input">
                    <input ref="displayStartYear" placeholder="Year"/>
                  </div>
                  To
                  <select ref="displayEndMonth" className="ui dropdown">
                    <option value="">Month</option>
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9">October</option>
                    <option value="10">November</option>
                    <option value="11">December</option>
                  </select>
                  <select ref="displayEndDay" className="ui dropdown">
                    <option value="">Day</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                  </select>
                  <div className="ui input">
                    <input ref="displayEndYear" placeholder="Year"/>
                  </div>
                  <button className="ui basic button" onClick={this.handleDisplayChange.bind(this)}><i className="calendar alternate icon"></i>Display</button>
                </div>
                {this.renderDays()}
              </div>
            </div>
        );
      case 2: //add-modify page
        return(
            <div className="ui container">
              <div className="ui top attached menu">
                <a className="item" onClick={this.handlePageChange.bind(this, 3)}><i className="user icon"></i> User Profile</a>
                <div className="ui right menu">
                  <a className="item" onClick={this.handleLogout.bind(this)}><i className="logout icon"></i> Logout</a>
                </div>
              </div>
              <div className="sixteen wide column">
                <div className="row">
                  <div className="header" style={{paddingLeft: 5 + 'px'}}>Add/Modify Event</div>
                </div>
                <div className="row">
                  <div className="ui grid">
                    <div className="two wide column" style={{textAlign: 'right'}}>Event Name:</div>
                    <div className="ten wide column">
                      <div className="ui input">
                        <input type="text" ref="eventName" placeholder="Event Name"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="ui grid">
                    <div className="two wide column" style={{textAlign: 'right'}}>Event Room:</div>
                    <div className="ten wide column">
                      <div className="ui input">
                        <input type="text" ref="eventRoom" placeholder="Room Name"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="ui grid">
                    <div className="two wide column" style={{textAlign: 'right'}}>Event Date:</div>
                    <div className="ten wide column">
                      <select ref="eventDateMonth" className="ui dropdown">
                        <option value="0">January</option>
                        <option value="1">February</option>
                        <option value="2">March</option>
                        <option value="3">April</option>
                        <option value="4">May</option>
                        <option value="5">June</option>
                        <option value="6">July</option>
                        <option value="7">August</option>
                        <option value="8">September</option>
                        <option value="9">October</option>
                        <option value="10">November</option>
                        <option value="11">December</option>
                      </select>
                      <select ref="eventDateDay" className="ui dropdown">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                      </select>
                      <div className="ui input"><input ref="eventDateYear" className="ui input" placeholder="Year" style={{width: 70 + 'px'}}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="ui grid">
                    <div className="two wide column" style={{textAlign: 'right'}}>Start Time:</div>
                    <div className="ten wide column">
                      <select ref="eventStartHour" className="ui dropdown ">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                      :
                      <select ref="eventStartMinute" className="ui dropdown">
                        <option value="0">00</option>
                        <option value="5">05</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                        <option value="30">30</option>
                        <option value="35">35</option>
                        <option value="40">40</option>
                        <option value="45">45</option>
                        <option value="50">50</option>
                        <option value="55">55</option>
                      </select>
                      <select ref="eventStartPM" className="ui dropdown">
                        <option value="0">AM</option>
                        <option value="1">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="ui grid">
                    <div className="two wide column" style={{textAlign: 'right'}}>End Time:</div>
                    <div className="ten wide column">
                      <select ref="eventEndHour" className="ui dropdown ">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                      :
                      <select ref="eventEndMinute" className="ui dropdown">
                        <option value="0">00</option>
                        <option value="5">05</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                        <option value="30">30</option>
                        <option value="35">35</option>
                        <option value="40">40</option>
                        <option value="45">45</option>
                        <option value="50">50</option>
                        <option value="55">55</option>
                      </select>
                      <select ref="eventEndPM" className="ui dropdown">
                        <option value="0">AM</option>
                        <option value="1">PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row" style={{padding: 50 + 'px'}}>
                  <button className="ui red button" onClick={this.handlePageChange.bind(this, 1)}>Cancel</button>
                  <button className="ui button" onClick={this.handleNewEvent.bind(this)}>Save Event</button>
                </div>
              </div>
            </div>
        );
      case 3: //user-profile page
        return(
            <div id="pagewrapper" className="ui container">
              <div className="ui top attached menu">
                <a className="item" onClick={this.handlePageChange.bind(this, 1)}><i className="calendar alternate icon"></i> Event Calendar</a>
                <div className="ui right menu">
                  <a className="item" onClick={this.handleLogout.bind(this)}><i className="logout icon"></i> Logout</a>
                </div>
              </div>
              <div className="header">Change My Password</div>
              <div className="ui centered grid">
                <div className="five wide column">

                  <div className="ui input"><input ref="oldPassword" placeholder="Your old password"/></div>


                  <div className="ui input"><input ref="changePassword" placeholder="Your new password"/></div>


                  <div className="ui input"><input ref="changePasswordConfirm" placeholder="Reenter new password"/></div>
                  <button onClick={this.handleChangePassword.bind(this)} className="ui button">Submit</button>

                </div>
              </div>
            </div>
        );
      case 4: //new-user page
        return(
            <div className="ui form container">
              <div className="login header">New User Creation</div>
              <p>
                <label>User Name: </label>
                <input ref="newUser" placeholder="User Name"/>
              </p>
              <p>
                <label>Password:</label>
                <input ref="newPassword" placeholder="Password"/>
              </p>
              <p>
                <input ref="confirmNewPassword" placeholder="Confirm"/>
              </p>
              <div className="ui two column grid">
                <div className="column" align="left">
                  <button style={{height: 40 + 'px'}} onClick={this.handlePageChange.bind(this, 0)}>Cancel</button>
                </div>
                <div className="column" align="right">
                  <button style={{height: 40 + 'px'}} onClick={this.handleRegister.bind(this)}>Create User</button>
                </div>
              </div>
            </div>
        );
    }
  }
}

//Database data structures

class event {
  constructor() {
    this.name = "";
    this.startTime = new Date;
    this.endTime = new Date;
    this.room = "";
    this.createdBy = "";
    this.lastModifiedBy = "";
  }
}

class user {
  constructor() {
    this.username = "";
    this.password = "";
  }
}

//JS database handle functions

//This will create a new event on the server with the parameters.
// For consistency we could change this function to accept an event object
function createEvent(name, startTime, endTime, room, createdBy) {
  events.insert({
    name: name,
    startTime: startTime,
    endTime: endTime,
    room: room,
    createdBy: createdBy,
    lastModifiedBy: createdBy,
  });

}

//This function will delete the event of the information given.
function deleteEvent(eventId) {
    return events.remove(eventId);
}

//This will update the event<id> with the event object given.
//Important note: the event given to this function must be an event without the _id parameter
//Meteor update will not allow documents with _id parameters to be updated;
function modifyEvent(event, id) {
  if (events.find(id).fetch()[0] !== undefined) {
    events.update(id, event);
    return true;
  }
  return false;
}

//This will return a event with an ID parameter, see note on modify event;
function modifyEventFetch(eventId){
  const foundEvents = events.find(eventId).fetch();
  return foundEvents[0];
}

//This function returns an array of events with matching day, month and year values.
function displayEvents(day) {
  const allEvents = events.find().fetch();
  let dayEvents = [];
  for (let event in allEvents) {
    if (allEvents[event].startTime !== undefined) {
      if (allEvents[event].startTime.getDay() == day.getDay() &&
      allEvents[event].startTime.getFullYear() == day.getFullYear() &&
      allEvents[event].startTime.getMonth() == day.getMonth()) {
        dayEvents.push(allEvents[event]);
      }
    }
  }
  return dayEvents;
}

//user database functions

//This function will add a user object to the users database
function addUser(username, password){
  if (getUser(username) === null) {
    users.insert({
      username: username,
      password: password,
    });
    return true;
  }
  return false;
}

//This function will return a user object matching the username parameter value
function getUser(username) {
  let allUsers = users.find().fetch();
  for (let user in allUsers){
    if (allUsers[user].username === username){return allUsers[user]}
  }
  return null;
}

//This function will update a user object
//user should be a user object--important note, this cannot be a direct object returned from getUser
//  You cannot re-insert an object that has a _id parameter.
//id comes from the user object returned from getUser
function updateUser(upUser, id){
  if (users.find(id).fetch()[0] !== undefined) {
    users.update(id, upUser);
    return true;
  }
  return false;
}

export{
  addUser, getUser, updateUser, displayEvents, modifyEvent, modifyEventFetch,
    createEvent, deleteEvent, event, user
}
