import React from 'react';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { events } from '../database.js';
import { users } from '../database.js';
import Day from './Day.js'
import Event from './Event.js'

export default class App extends Component{
  constructor(props){
    super(props);

    addUser('admin', 'admin'); //make an admin account for test suite

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
    if(this.state.page === 2){
      this.setState({
        eventMod: null,
      });
    }
    this.setState({page: pageNum});
  }

  handleLogin(){
    const username = ReactDOM.findDOMNode(this.refs.userInput).value.trim();
    const password = ReactDOM.findDOMNode(this.refs.pwInput).value.trim();

    let user = getUser(username);
    if(user === null){
      alert("Username or Password is incorrect.");
      return;
    }
    if(user.password === password){
      this.setState({
        user: user,
      });
      this.handlePageChange(1);
      return;
    }
    alert("Username or Password is incorrect.");
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

  handleRegister() {
    const username = ReactDOM.findDOMNode(this.refs.newUser).value.trim();
    const password = ReactDOM.findDOMNode(this.refs.newPassword).value.trim();
    const confirm = ReactDOM.findDOMNode(this.refs.confirmNewPassword).value.trim();

    if (password === confirm) {
      if(addUser(username, password)) {
        this.handlePageChange(0);
      } else {
        alert("Username " + username + " is already taken.");
      }
    } else {
      alert("Your password and confirmation password do not match.");
    }
  }


  handleChangePassword(){
    const old = ReactDOM.findDOMNode(this.refs.oldPassword).value.trim();
    const myNew = ReactDOM.findDOMNode(this.refs.changePassword).value.trim();
    const confirm = ReactDOM.findDOMNode(this.refs.changePasswordConfirm).value.trim();

    const user = getUser(this.state.user.username);
    if(old === user.password && myNew === confirm){
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

    let start = new Date(startYear, startMonth, startDay);
    let end = new Date(endYear, endMonth, endDay);

    if(start.getMonth() != startMonth || end.getMonth() != endMonth){
      alert("One of your chosen range bounds is not an actual day.\nPlease make sure you are entering days that exist.");
      return;
    }
    if(end.getTime() < start.getTime()){
      alert("Selected start date is after selected start date.\nPlease change your date range and try again");
      return;
    }
    if(endYear - startYear > 5){
      alert("Selected display range too broad.\nPlease make sure your start and end dates are within 5 years of each other.");
      return;
    }

    this.setState({
      startDay: start,
      endDay: end,
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

    if(isNaN(eventYear)|| eventYear.length != 4){
      alert("The year field should contain a valid, 4 digit year.\nPlease reenter a year and try again.");
      return;
    }

    if((eventStartHour === '12') && (eventStartPM === '0')){
      eventStartHour = 0;
    }else if(eventStartPM === '1'){
      eventStartHour = parseInt(eventStartHour) + 12;
    }
    if((eventEndHour === '12') && (eventEndPM === '0')){
      eventEndHour = 0;
    }else if(eventEndPM === '1'){
      eventEndHour = parseInt(eventEndHour) + 12;
    }

    const startDate = new Date(eventYear, eventMonth, eventDay, eventStartHour, eventStartMinute);
    const endDate = new Date(eventYear, eventMonth, eventDay, eventEndHour, eventEndMinute);

    if(this.state.eventMod === null){
      let code = createEvent(eventName, startDate, endDate, eventRoom, this.state.user.username);
      console.log(code);
      if(code === true){
        this.handlePageChange(1);
      }else if(code === 0){
        alert("Event start time is after event end time.\nPlease change event start and/or end time.");
      }else if(code === -1){
        alert("An event is already being held in " + eventRoom + "at the same time.\nPlease change event time or room");
      }else{
        alert("Selected date is before today's date.\nPlease change event date.");
      }
    }else{
      let code = modifyEvent({
        name: eventName,
        startTime: startDate,
        endTime: endDate,
        room: eventRoom,
        createdBy: this.state.eventMod.createdBy,
        lastModifiedBy: this.state.user.username,
      },this.state.eventMod._id);
      console.log(code);
      if(code === true){
        this.handlePageChange(1);
      }else if(code === 0){
        alert("Event start time is after event end time.\nPlease change event start and/or end time.");
      }else if(code === -1){
        alert("An event is already being held in " + eventRoom + "at the same time.\nPlease change event time or room");
      }else{
        alert("Selected date is before today's date.\nPlease change event date.");
      }
    }
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
    }
    if(end.getTime() > start.getTime()){
      output.push(end);
    }
    return(output);
  }

  getModName(){
    if(this.state.eventMod === null){
      return(null);
    }
    return(this.state.eventMod.name);
  }

  getModRoom(){
    if(this.state.eventMod === null){
      return(null);
    }
    return(this.state.eventMod.room);
}

  getModMonth(){
    if(this.state.eventMod === null){
      return(new Date(Date.now()).getMonth());
    }
    return(this.state.eventMod.startTime.getMonth());
  }

  getModDay(){
    if(this.state.eventMod === null){
      return(new Date(Date.now()).getDate());
    }
    return(this.state.eventMod.startTime.getDate());
  }

  getModYear(){
    if(this.state.eventMod === null){
      return(new Date(Date.now()).getFullYear());
    }
    return(this.state.eventMod.startTime.getFullYear());
  }

  getModStartHour(){
    if(this.state.eventMod === null){
      return(null);
    }
    let out = this.state.eventMod.startTime.getHours();
    if(out === 0){
      return(12);
    }
    if(out > 12){
      return(out-12);
    }
    return(out);
  }

  getModEndHour(){
    if(this.state.eventMod === null){
      return(null);
    }
    let out = this.state.eventMod.endTime.getHours();
    if(out === 0){
      return(12);
    }
    if(out > 12){
      return(out-12);
    }
    return(out);
  }

  getModStartMinutes(){
    if(this.state.eventMod === null){
      return(null);
    }

    return(this.state.eventMod.startTime.getMinutes());
  }

  getModEndMinutes(){
    if(this.state.eventMod === null){
      return(null);
    }

    return(this.state.eventMod.endTime.getMinutes());
  }

  getModStartPM(){
    if(this.state.eventMod === null){
      return(null);
    }
    if(this.state.eventMod.startTime.getHours() >= 12){
      return(1);
    }
    return(0);
  }

  getModEndPM(){
    if(this.state.eventMod === null){
      return(null);
    }
    if(this.state.eventMod.endTime.getHours() >= 12){
      return(1);
    }
    return(0);
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
                <input type='password' ref="pwInput" placeholder="Password"/>
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
                  <select defaultValue={new Date(Date.now()).getMonth()} ref="displayStartMonth" className="ui dropdown">
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
                  <select defaultValue={new Date(Date.now()).getDate()} ref="displayStartDay" className="ui dropdown">
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
                    <input ref="displayStartYear" defaultValue={new Date(Date.now()).getFullYear()}/>
                  </div>
                  To
                  <select defaultValue={new Date(Date.now()).getMonth()} ref="displayEndMonth" className="ui dropdown">
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
                  <select defaultValue={new Date(Date.now()).getDate()} ref="displayEndDay" className="ui dropdown">
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
                    <input ref="displayEndYear" defaultValue={new Date(Date.now()).getFullYear()}/>
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
                <a className="item" onClick={this.handlePageChange.bind(this, 1)}><i className="calendar alternate icon"></i> Event Calendar</a>
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
                        <input type="text" ref="eventName" placeholder="Event Name" defaultValue={this.getModName()}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="ui grid">
                    <div className="two wide column" style={{textAlign: 'right'}}>Event Room:</div>
                    <div className="ten wide column">
                      <div className="ui input">
                        <input type="text" ref="eventRoom" placeholder='Room Name' defaultValue={this.getModRoom()}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="ui grid">
                    <div className="two wide column" style={{textAlign: 'right'}}>Event Date:</div>
                    <div className="ten wide column">
                      <select ref="eventDateMonth" className="ui dropdown" defaultValue={this.getModMonth()}>
                        <option value="0" >January</option>
                        <option value="1" >February</option>
                        <option value="2" >March</option>
                        <option value="3" >April</option>
                        <option value="4" >May</option>
                        <option value="5" >June</option>
                        <option value="6" >July</option>
                        <option value="7" >August</option>
                        <option value="8" >September</option>
                        <option value="9" >October</option>
                        <option value="10" >November</option>
                        <option value="11" >December</option>
                      </select>
                      <select ref="eventDateDay" className="ui dropdown" defaultValue={this.getModDay()}>
                        <option value="1" >1</option>
                        <option value="2" >2</option>
                        <option value="3" >3</option>
                        <option value="4" >4</option>
                        <option value="5" >5</option>
                        <option value="6" >6</option>
                        <option value="7" >7</option>
                        <option value="8" >8</option>
                        <option value="9" >9</option>
                        <option value="10" >10</option>
                        <option value="11" >11</option>
                        <option value="12" >12</option>
                        <option value="13" >13</option>
                        <option value="14" >14</option>
                        <option value="15" >15</option>
                        <option value="16" >16</option>
                        <option value="17" >17</option>
                        <option value="18" >18</option>
                        <option value="19" >19</option>
                        <option value="20" >20</option>
                        <option value="21" >21</option>
                        <option value="22" >22</option>
                        <option value="23" >23</option>
                        <option value="24" >24</option>
                        <option value="25" >25</option>
                        <option value="26" >26</option>
                        <option value="27" >27</option>
                        <option value="28" >28</option>
                        <option value="29" >29</option>
                        <option value="30" >30</option>
                        <option value="31" >31</option>
                      </select>
                      <div className="ui input"><input ref="eventDateYear" className="ui input" defaultValue={this.getModYear()} placeholder='Year' style={{width: 70 + 'px'}}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="ui grid">
                    <div className="two wide column" style={{textAlign: 'right'}}>Start Time:</div>
                    <div className="ten wide column">
                      <select ref="eventStartHour" className="ui dropdown " defaultValue={this.getModStartHour()}>
                        <option value="1" >1</option>
                        <option value="2" >2</option>
                        <option value="3" >3</option>
                        <option value="4" >4</option>
                        <option value="5" >5</option>
                        <option value="6" >6</option>
                        <option value="7" >7</option>
                        <option value="8" >8</option>
                        <option value="9" >9</option>
                        <option value="10" >10</option>
                        <option value="11" >11</option>
                        <option value="12" >12</option>
                      </select>
                      :
                      <select ref="eventStartMinute" className="ui dropdown" defaultValue={this.getModStartMinutes()}>
                        <option value="0" >00</option>
                        <option value="5" >05</option>
                        <option value="10" >10</option>
                        <option value="15" >15</option>
                        <option value="20" >20</option>
                        <option value="25" >25</option>
                        <option value="30" >30</option>
                        <option value="35" >35</option>
                        <option value="40" >40</option>
                        <option value="45" >45</option>
                        <option value="50" >50</option>
                        <option value="55" >55</option>
                      </select>
                      <select ref="eventStartPM" className="ui dropdown" defaultValue={this.getModStartPM()}>
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
                      <select ref="eventEndHour" className="ui dropdown " defaultValue={this.getModEndHour()}>
                        <option value="1" >1</option>
                        <option value="2" >2</option>
                        <option value="3" >3</option>
                        <option value="4" >4</option>
                        <option value="5" >5</option>
                        <option value="6" >6</option>
                        <option value="7" >7</option>
                        <option value="8" >8</option>
                        <option value="9" >9</option>
                        <option value="10" >10</option>
                        <option value="11" >11</option>
                        <option value="12" >12</option>
                      </select>
                      :
                      <select ref="eventEndMinute" className="ui dropdown" defaultValue={this.getModEndMinutes()}>
                        <option value="0" >00</option>
                        <option value="5" >05</option>
                        <option value="10" >10</option>
                        <option value="15" >15</option>
                        <option value="20" >20</option>
                        <option value="25" >25</option>
                        <option value="30" >30</option>
                        <option value="35" >35</option>
                        <option value="40" >40</option>
                        <option value="45" >45</option>
                        <option value="50" >50</option>
                        <option value="55" >55</option>
                      </select>
                      <select ref="eventEndPM" className="ui dropdown" defaultValue={this.getModEndPM()}>
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
                <input type="password" ref="newPassword" placeholder="Password"/>
              </p>
              <p>
                <input type="password" ref="confirmNewPassword" placeholder="Confirm"/>
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

//This function will return true if conflict exists, false if no conflict
function testConflict(startTime, endTime, room, id) {
     const allEvents = events.find().fetch();
     for (let event in allEvents) {
       if (id !== allEvents[event]._id) {   //if we are modifying an event, don't compare to self
         if (allEvents[event].room === room) {  //check if we are in the same room before comparing
           if ((allEvents[event].startTime.getTime() < startTime.getTime()) &&
               (allEvents[event].endTime.getTime() > startTime.getTime())) {
             return true;
           } else if ((allEvents[event].startTime.getTime() < endTime.getTime()) &&
               (allEvents[event].endTime.getTime() > endTime.getTime())) {
             return true;
           } else if ((allEvents[event].startTime.getTime() > startTime.getTime()) &&
               (allEvents[event].endTime.getTime() > endTime.getTime())) {
             return true;
           }
         }
       }
     }
     return false;
}

//This will create a new event on the server with the parameters.
// For consistency we could change this function to accept an event object
//Codes:
//Event successfully added: true
//Event conflict: -1
//Event Start time is after end time: 0
//Event is before current date(year, month, day): -2
function createEvent(name, startTime, endTime, room, createdBy) {
  const today = new Date();
  today.setTime(Date.now());
  if (!testConflict(startTime, endTime, room, null)) {
    if (startTime.getTime() >= endTime.getTime()) {
      return 0; // startTime is after endTime code
    } else if((today.getDate() > startTime.getDate()) &&
        (today.getFullYear() > startTime.getFullYear()) &&
        (today.getMonth() > startTime.getMonth())) {
      return -2;
    } else {
      events.insert({
        name: name,
        startTime: startTime,
        endTime: endTime,
        room: room,
        createdBy: createdBy,
        lastModifiedBy: createdBy,
      });
      return true;
    }
  } else {
    return -1; //conflict with another event code
  }
}

//This function will delete the event of the information given.
function deleteEvent(eventId) {
    return events.remove(eventId);
}

//This will update the event<id> with the event object given.
//Important note: the event given to this function must be an event without the _id parameter
//Meteor update will not allow documents with _id parameters to be updated;
function modifyEvent(event, id) {
  const startTime = event.startTime;
  const endTime = event.endTime;
  const room = event.room;
  const today = new Date();
  today.setTime(Date.now());
  if (!testConflict(startTime, endTime, room, id)) {
    if (startTime.getTime() >= endTime.getTime()) {
      return 0; // startTime is after endTime code
    } else if((today.getDay() > startTime.getDay()) &&
        (today.getFullYear() > startTime.getFullYear()) &&
        (today.getMonth() > startTime.getMonth())) {
      return -2;
    } else {
      if (events.find(id).fetch()[0] !== undefined) {
        events.update(id, event);
        return true;
      }
    }
  } else {
    return -1; //conflict with another event code
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
      if (allEvents[event].startTime.getDate() == day.getDate() &&
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
