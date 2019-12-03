import React from 'react';
import { Component } from 'react';
import ReactDOM from 'react-dom';

export default class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      page: 0,
    };
  }

  handlePageChange(pageNum){
    this.setState({page: pageNum});
  }

  handleLogin(){
    const username = ReactDOM.findDOMNode(this.refs.userInput).value.trim();
    const password = ReactDOM.findDOMNode(this.refs.pwInput).value.trim();
    //do stuff to compare these with user database

    this.handlePageChange(1);
  }

  handleNewEvent(){
    const eventName = ReactDOM.findDOMNode(this.refs.eventName).value.trim();
    const eventRoom = ReactDOM.findDOMNode(this.refs.eventRoom).value.trim();

    const eventMonth = ReactDOM.findDOMNode(this.refs.eventDateMonth).value.trim();
    const eventDay = ReactDOM.findDOMNode(this.refs.eventDateDay).value.trim();
    const eventYear = ReactDOM.findDOMNode(this.refs.eventDateYear).value.trim();
    const eventStartHour = ReactDOM.findDOMNode(this.refs.eventStartHour).value.trim();
    const eventStartMinute = ReactDOM.findDOMNode(this.refs.eventStartMinute).value.trim();
    const eventStartPM = ReactDOM.findDOMNode(this.refs.eventStartPM).value.trim();
    const eventEndHour = ReactDOM.findDOMNode(this.refs.eventEndHour).value.trim();
    const eventEndMinute = ReactDOM.findDOMNode(this.refs.eventEndMinute).value.trim();
    const eventEndPM = ReactDOM.findDOMNode(this.refs.eventEndPM).value.trim();

    //still have to fix the hour representation...

    const startDate = new Date(eventYear, eventMonth, eventDay, (eventStartHour - 1) + (12*eventStartPM), eventStartMinute);
    const endDate = new Date(eventYear, eventMonth, eventDay, (eventEndHour - 1) + (12*eventEndPM), eventEndMinute);

    //do stuff with the captured info.....
    console.log(startDate);
    console.log(endDate);
    this.handlePageChange(1);
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
                  <a className="item" onClick={this.handlePageChange.bind(this, 0)}><i className="logout icon"></i> Logout</a>
                </div>
              </div>
              <div className="ui grid">
                <div id="date-select" className="sixteen wide column">
                  <p>Display Events</p>
                  From
                  <select className="ui dropdown">
                    <option value="">Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <select className="ui dropdown">
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
                    <input placeholder="Year"/>
                  </div>
                  To
                  <select className="ui dropdown">
                    <option value="">Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <select className="ui dropdown">
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
                    <input placeholder="Year"/>
                  </div>
                  <button className="ui basic button"><i className="calendar alternate icon"></i>Display</button>
                </div>
                <div className="sixteen wide column">
                  <div className="date-header">January 1, 2020</div>
                  <div className="ui grid">
                    <div className="eight wide column">
                      <div className="ui fluid card">
                        <div className="header">Event Name A</div>
                        <div className="ui grid">
                          <div className="six wide column">
                            <p className="align-right">Start Time:</p>
                            <p className="align-right">End Time:</p>
                            <p className="align-right">Room:</p>
                          </div>
                          <div className="five wide column">
                            <p>2:00PM</p>
                            <p>3:00PM</p>
                            <p>Meeting Room A</p>
                          </div>
                          <div className="column">
                            <button className="ui button"><i className="edit icon"></i>Modify Event</button>
                            <button className="ui red button"><i className="close icon"></i>Delete Event</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eight wide column">
                      <div className="ui fluid card">
                        <div className="header">Event Name B</div>
                        <div className="ui grid">
                          <div className="six wide column">
                            <p className="align-right">Start Time:</p>
                            <p className="align-right">End Time:</p>
                            <p className="align-right">Room:</p>
                          </div>
                          <div className="five wide column">
                            <p>4:00PM</p>
                            <p>5:00PM</p>
                            <p>Meeting Room B</p>
                          </div>
                          <div className="column">
                            <button className="ui button"><i className="edit icon"></i>Modify Event</button>
                            <button className="ui red button"><i className="close icon"></i>Delete Event</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eight wide column">
                      <div className="ui fluid card">
                        <div className="header">Event Name C</div>
                        <div className="ui grid">
                          <div className="six wide column">
                            <p className="align-right">Start Time:</p>
                            <p className="align-right">End Time:</p>
                            <p className="align-right">Room:</p>
                          </div>
                          <div className="five wide column">
                            <p>1:00PM</p>
                            <p>1:30PM</p>
                            <p>Meeting Room B</p>
                          </div>
                          <div className="column">
                            <button className="ui button"><i className="edit icon"></i>Modify Event</button>
                            <button className="ui red button"><i className="close icon"></i>Delete Event</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="sixteen wide column">
                  <div className="date-header">January 2, 2020</div>
                  <div className="ui grid">
                    <div className="eight wide column">
                      <div className="ui fluid card">
                        <div className="header">Event Name A</div>
                        <div className="ui grid">
                          <div className="six wide column">
                            <p className="align-right">Start Time:</p>
                            <p className="align-right">End Time:</p>
                            <p className="align-right">Room:</p>
                          </div>
                          <div className="five wide column">
                            <p>2:00PM</p>
                            <p>3:00PM</p>
                            <p>Meeting Room A</p>
                          </div>
                          <div className="column">
                            <button className="ui button"><i className="edit icon"></i>Modify Event</button>
                            <button className="ui red button"><i className="close icon"></i>Delete Event</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eight wide column">
                      <div className="ui fluid card">
                        <div className="header">Event Name B</div>
                        <div className="ui grid">
                          <div className="six wide column">
                            <p className="align-right">Start Time:</p>
                            <p className="align-right">End Time:</p>
                            <p className="align-right">Room:</p>
                          </div>
                          <div className="five wide column">
                            <p>4:00PM</p>
                            <p>5:00PM</p>
                            <p>Meeting Room B</p>
                          </div>
                          <div className="column">
                            <button className="ui button"><i className="edit icon"></i>Modify Event</button>
                            <button className="ui red button"><i className="close icon"></i>Delete Event</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eight wide column">
                      <div className="ui fluid card">
                        <div className="header">Event Name C</div>
                        <div className="ui grid">
                          <div className="six wide column">
                            <p className="align-right">Start Time:</p>
                            <p className="align-right">End Time:</p>
                            <p className="align-right">Room:</p>
                          </div>
                          <div className="five wide column">
                            <p>1:00PM</p>
                            <p>1:30PM</p>
                            <p>Meeting Room B</p>
                          </div>
                          <div className="column">
                            <button className="ui button"><i className="edit icon"></i>Modify Event</button>
                            <button className="ui red button"><i className="close icon"></i>Delete Event</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
      case 2: //add-modify page
        return(
            <div className="ui container">
              <div className="ui top attached menu">
                <a className="item" onClick={this.handlePageChange.bind(this, 3)}><i className="user icon"></i> User Profile</a>
                <div className="ui right menu">
                  <a className="item" onClick={this.handlePageChange.bind(this, 0)}><i className="logout icon"></i> Logout</a>
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
                  <a className="item" onClick={this.handlePageChange.bind(this, 0)}><i className="logout icon"></i> Logout</a>
                </div>
              </div>
              <div className="header">Change My Password</div>
              <div className="ui centered grid">
                <div className="five wide column">
                  <p>
                    <div className="ui input"><input placeholder="Your old password"/></div>
                  </p>
                  <p>
                    <div className="ui input"><input placeholder="Your new password"/></div>
                  </p>
                  <p>
                    <div className="ui input"><input placeholder="Reenter new password"/></div>
                    <button className="ui button">Submit</button>
                  </p>
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
                <input placeholder="User Name"/>
              </p>
              <p>
                <label>Email:</label>
                <input placeholder="Email:"/>
              </p>
              <p>
                <label>Password:</label>
                <input placeholder="Password"/>
              </p>
              <p>
                <input placeholder="Confirm"/>
              </p>
              <div className="ui two column grid">
                <div className="column" align="left">
                  <button style={{height: 40 + 'px'}} onClick={this.handlePageChange.bind(this, 0)}>Cancel</button>
                </div>
                <div className="column" align="right">
                  <button style={{height: 40 + 'px'}}>Create User</button>
                </div>
              </div>
            </div>
        );
    }
  }
}
