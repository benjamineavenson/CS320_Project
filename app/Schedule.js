const MAXEVENTS = 1000;
const MAXDAYS = 1000;

class schedule{
  constructor(){
    this.days = new day[MAXDAYS];
    this.eventBuilder = new eventbuilder;
  }

  addEvent(event, day){}

  display(startDate, endDate){}

  delete(event, day){}

  modifyEvent(event, day){}

}

class eventBuilder{
  constructor(){
    this.name = new string;
    this.currentID = new integer;
    this.startTime = new date;
    this.endTime = new date;
    this.room = new string;
  }

  createEvent(){}
  modifyEvent(){}
  setName(name){}
  setStartTime(date){}
  setEndTime(date){}
  setRoom(room){}
}
class day{
  constructor() {
    this.events[] = new event[MAXEVENTS];
    this.date = new date;
  }

  addEvent(event){

  }

  display(){}

  delete(event){}

}

class event{
  constructor(){
    this.name = new string;
    this.startTime = new date;
    this.endTime = new date;
    this.room = new string;
    this.ID = new string;
    this.createdBy = new string;
    this.lastModifiedBy = new string;
  }

  display() {
    //display event info to webpage
  }
}