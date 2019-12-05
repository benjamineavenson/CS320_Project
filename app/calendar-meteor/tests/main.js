import assert from "assert";
import { events } from '../imports/database.js';
import { users } from '../imports/database.js';
import { createEvent } from '../imports/ui/App.js';
import { deleteEvent } from '../imports/ui/App.js';
import { modifyEventFetch } from '../imports/ui/App.js';
import { modifyEvent } from '../imports/ui/App.js';
import { event } from '../imports/ui/App.js';
import { user } from '../imports/ui/App.js';
import { displayEvents } from '../imports/ui/App';
import { addUser } from '../imports/ui/App';
import { getUser } from '../imports/ui/App';
import { updateUser } from '../imports/ui/App';


//To run these tests, invoke the below command when launching meteor:
//meteor test --full-app --driver-package meteortesting:mocha
describe("calendar-meteor", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "calendar-meteor");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }

  //Meteor interface tests
  describe('Meteor Database Interface Tests', function(){
    events.remove({}); //clear events database before testing
    //Event functions
    describe('Add Event to database:', function(){
      it('Should add event without error', function(){
        const startTime = new Date(3000, 1,1, 5);
        const endTime = new Date(3000, 1, 1, 6);
        createEvent("testEvent1", startTime, endTime, 'test room', 'test user');
        const testEvent = createTestEvent('testEvent1', startTime, endTime, 'test room', 'test user');
        const storedEvent = events.find(testEvent).fetch();
        assert.equal(storedEvent[0].name, 'testEvent1');
        assert.equal(storedEvent[0].room, 'test room');
        assert.equal(storedEvent[0].createdBy, 'test user');
        assert.equal(storedEvent[0].lastModifiedBy, 'test user');
      });
    });
    describe('Remove Event in database', function(){
      it('Should remove add and remove an event without error', function(){
        const startTime = new Date(3000, 1,1, 5);
        const endTime = new Date(3000, 1, 1, 6);
        const testEvent = createTestEvent('testEvent2', startTime, endTime, 'test room', 'test user');
        events.insert(testEvent);
        const eventBefore = events.find(testEvent).fetch();
        deleteEvent(eventBefore[0]._id);
        const eventAfter = events.find(testEvent).fetch();
        assert.notDeepEqual(eventBefore, eventAfter);
      });
    });
    describe('Modify event in database', function(){
      it('Should modify an event and return it to the database', function(){
        const startTime = new Date(3000, 1,1, 5);
        const endTime = new Date(3000, 1, 1, 6);
        createEvent("testEvent3", startTime, endTime, 'test room', 'test user');
        const testEvent = createTestEvent('testEvent3', startTime, endTime, 'test room', 'test user');
        let storedEvent = events.find(testEvent).fetch()[0];
        const modEvent = createTestEvent('testEvent4', startTime, endTime, 'test room', 'test user');
        modifyEvent(modEvent, storedEvent._id);
        storedEvent = events.find(modEvent).fetch()[0];
        assert.equal(storedEvent.name, 'testEvent4');
        assert.equal(storedEvent.room, 'test room');
        assert.equal(storedEvent.createdBy, 'test user');
        assert.equal(storedEvent.lastModifiedBy, 'test user');
      });
    });
    describe('Display events functionality', function(){
      it('Should return a list of events in the given scope of the day', function(){
        const startTime = new Date(3000, 1,1, 5);
        const endTime = new Date(3000, 1, 1, 6);
        createEvent("testEvent5", startTime, endTime, 'test room', 'test user');
        createEvent("testEvent6", startTime, endTime, 'test room', 'test user');
        createEvent("testEvent7", startTime, endTime, 'test room', 'test user');
        createEvent("testEvent8", startTime, endTime, 'test room', 'test user');
        createEvent("testEvent9", startTime, endTime, 'test room', 'test user');
        const eventDisplay = displayEvents(new Date(3000, 1, 1));
        createEvent("testEvent10", new Date(3000, 1, 3, 5),
            new Date(3000, 1, 3, 6), 'test room', 'test user');
        const reDisplay = displayEvents(new Date(3000, 1, 1));
        assert.deepEqual(reDisplay, eventDisplay);
      });
    });

    //Event Error handling
    describe('Remove Event that does not exist', function() {
      it('Should return false if no event exists', function () {
        const startTime = new Date(3000, 1, 1, 1);
        const endTime = new Date(3000, 1, 1, 2);
        createEvent('deleteMe', startTime, endTime, 'deleteroom', 'me');
        const testEvent = createTestEvent('deleteMe', startTime, endTime, 'deleteroom', 'me');
        const removeEvent = events.find(testEvent).fetch()[0];
        assert(deleteEvent(removeEvent));
        assert.strictEqual(deleteEvent(removeEvent), 0);
      });
    });
    describe('modifyEventFetch event that does not exist', function() {
      it('modifyEventFetch should return undefined if no event was found', function () {
        const startTime = new Date(3000, 1, 1, 1);
        const endTime = new Date(3000, 1, 1, 2);
        const testEvent = createTestEvent('whereAmI', startTime, endTime, 'abyss', 'me');
        createEvent('whereAmI', startTime, endTime, 'abyss', 'me');
        const dbEvent = events.find(testEvent).fetch()[0];
        deleteEvent(dbEvent._id);
        assert.strictEqual(modifyEventFetch(dbEvent._id), undefined);
      });
    });
    describe('modifyEvent that does not exist', function () {
      it('Should return  if no event exists with the _id', function () {
        const testEvent = createTestEvent('I dont Exist', new Date(3000), new Date(3500), 'nowhere', 'me');
        createEvent('I dont Exist', new Date(3000), new Date(3500), 'nowhere', 'me');
        const dbEvent = events.find(testEvent).fetch()[0];
        deleteEvent(dbEvent._id);
        assert.equal(modifyEvent(testEvent, dbEvent._id), false);
      });
    });
    describe('Add an event that conflicts with an event already in the system', function() {
      it('createEvent should return -1 if there was a conflict', function () {
        createEvent('eventNoConflict', new Date(3000, 1, 1, 1), new Date(3000, 1, 1, 5),
            'room1', 'me');
        assert.equal(createEvent('conflictEvent', new Date(3000, 1, 1, 2),
            new Date(3000, 1, 1, 7), 'room1', 'me'), -1);
      });
    });
    describe('Add an event with startTime greater than endTime', function () {
      it('Should return code 0 for bad start/end time', function () {
        assert.equal(createEvent('badStart', new Date(3000), new Date(2000), 'badTimeRoom', 'me'), 0);
      });
    });
    describe('Add an event with startTime equal t0 endTime', function () {
      it('Should return code 0 for bad start/end time', function () {
        assert.equal(createEvent('badStart', new Date(2000), new Date(2000), 'badTimeRoom', 'me'), 0);
      });
    });

    //User functions
    users.remove({}); //clear users database before testing
    describe('Add user to database', function(){
      it('Should add a user with no issues', function(){
        addUser('Test User 1', 'pass1');
        const gotUser = getUser('Test User 1');
        const testUser = users.find(gotUser).fetch();
        assert.deepEqual(gotUser, testUser[0]);
      });
    });
    describe('Modify user in database', function(){
      it('Should modify a user with no issue', function(){
        addUser('Test User 2', 'pass2');
        const gotUser = getUser('Test User 2');
        const testUser = new user();
        testUser.username = 'Test User 2.5'
        testUser.password = gotUser.password;
        updateUser(testUser, gotUser._id);
        let newUser = getUser('Test User 2');//should return null
        assert.notDeepEqual(newUser, gotUser);
        newUser = getUser('Test User 2.5');
        assert.equal(newUser.username, 'Test User 2.5');
      });
    });

    //User Error Handling
    describe('Add user that already exists', function() {
      it('Should return false', function() {
        addUser("testUser", 'password');
        assert.equal(addUser('testUser', 'otherpassword'), false);
      });
    });
    describe('Try to modify User that does not exist', function () {
      it('Should return false if no user is found to modify with given ID', function () {
        addUser('test', 'pass');
        const testUser = getUser('test');
        const newUser = new user();
        newUser.password = 'pass';
        newUser.username = 'test2';
        users.remove({});
        assert.equal(updateUser(user, testUser._id), false);
      })
    })

  });
});

//Test helper functions
function createTestEvent (name, startTime, endTime, room, user) {
  const testEvent = new event();
  testEvent.name = name;
  testEvent.startTime = startTime;
  testEvent.endTime = endTime;
  testEvent.room = room;
  testEvent.createdBy = user;
  testEvent.lastModifiedBy = user;
  return testEvent;
}
