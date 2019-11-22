//constant enums
const MAXDAYS = 1000;
const MAXEVENTS = 1000;



class schedule{
  constructor(){
    this.days = new day[MAXDAYS];
    this.eventBuilder = new eventBuilder;
  }

  addEvent(event, day){

  }

  modifyEvent(event, day){}

  display(startDate, endDate){
    for (let day = 0; day < this.days.length; day++){
      if (this.days[day].date.getTime() !== new Date.getTime()){ //not sure if this is how you evaluate for a null date
        if ((this.days[day].date.getTime() <= endDate.getTime()) ||
            (this.days[day].date.getTime() >= startDate.getTime())){
          this.days[day].display();
        }
      }
    }
  }

  delete(event, day){
    for (let dayIndex = 0; dayIndex <= this.days.length; dayIndex++){
      if (this.days[dayIndex].getTime() === day.getTime()){
        this.days[dayIndex].delete(event);
        break;}
    }
  }



}

class eventBuilder{
  constructor(){
    this.name = "";
    this.currentID = 0;
    this.startTime = new Date;
    this.endTime = new Date;
    this.room = "";
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
    this.events = new event[MAXEVENTS];
    this.date = new Date;
  }

  addEvent(event){
    for (let eventIndex = 0; eventIndex <= this.events.length; eventIndex++){
      if (this.events[eventIndex].ID === event.ID){this.events[eventIndex] = event; return;}
      if (this.events[eventIndex].ID === ""){this.events[eventIndex] = event; return;}
    }
    // no open days and we aren't modifying a known day
  }

  display(){
    for (let eventIndex = 0; eventIndex <= this.events.length; eventIndex++){
      if (this.events[eventIndex].ID !== "") {
        this.events[eventIndex].display()
      }
    }
  }

  delete(event){
    for (let eventIndex = 0; eventIndex <= this.events.length; eventIndex++){
      if(this.events[eventIndex].ID === event.ID){
        event.ID = ""; //events without IDs are not valid and are considered junk data
      }
    }
  }

}

class event{
  constructor(){
    this.name = "";
    this.startTime = new Date;
    this.endTime = new Date;
    this.room = "";
    this.ID = "";
    this.createdBy = "";
    this.lastModifiedBy = "";
  }

  display() {}
}