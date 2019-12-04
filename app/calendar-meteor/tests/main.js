import assert from "assert";
import { events } from '../imports/database.js';
import { users } from '../imports/database.js';
import { createEvent } from '../imports/ui/App.js';
import { deleteEvent } from '../imports/ui/App.js';
import { modifyEventFetch } from '../imports/ui/App.js';
import { modifyEvent } from '../imports/ui/App.js';
import { event } from '../imports/ui/App.js';
import { displayEvents } from '../imports/ui/App';

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
    events.remove({});
    describe('Add Event to database:', function(){
      it('Should add event without error', function(){
        const startTime = new Date(2001, 1,1, 5);
        const endTime = new Date(2001, 1, 1, 6);
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
        const startTime = new Date(2001, 1,1, 5);
        const endTime = new Date(2001, 1, 1, 6);
        const testEvent = createTestEvent('testEvent2', startTime, endTime, 'test room', 'test user');
        events.insert(testEvent);
        const eventBefore = events.find(testEvent).fetch();
        deleteEvent(testEvent);
        const eventAfter = events.find(testEvent).fetch();
        assert.notDeepEqual(eventBefore, eventAfter);
      });
    });
    describe('Modify event in database', function(){
      it('Should modify an event and return it to the database', function(){
        const startTime = new Date(2001, 1,1, 5);
        const endTime = new Date(2001, 1, 1, 6);
        createEvent("testEvent3", startTime, endTime, 'test room', 'test user');
        const testEvent = createTestEvent('testEvent3', startTime, endTime, 'test room', 'test user');
        let storedEvent = modifyEventFetch(testEvent);
        const modEvent = createTestEvent('testEvent4', startTime, endTime, 'test room', 'test user');
        modifyEvent(modEvent, storedEvent[0]._id);
        storedEvent = events.find(storedEvent[0]._id).fetch();
        assert.equal(storedEvent[0].name, 'testEvent4');
        assert.equal(storedEvent[0].room, 'test room');
        assert.equal(storedEvent[0].createdBy, 'test user');
        assert.equal(storedEvent[0].lastModifiedBy, 'test user');
      });
    });
    describe('Display events functionality', function(){
      it('Should return a list of events in the given scope of the day', function(){
        const startTime = new Date(2001, 1,1, 5);
        const endTime = new Date(2001, 1, 1, 6);
        createEvent("testEvent5", startTime, endTime, 'test room', 'test user');
        createEvent("testEvent6", startTime, endTime, 'test room', 'test user');
        createEvent("testEvent7", startTime, endTime, 'test room', 'test user');
        createEvent("testEvent8", startTime, endTime, 'test room', 'test user');
        createEvent("testEvent9", startTime, endTime, 'test room', 'test user');
        const eventDisplay = displayEvents(new Date(2001, 1, 1));
        createEvent("testEvent10", new Date(2001, 1, 3, 5),
            new Date(2001, 1, 3, 6), 'test room', 'test user');
        const reDisplay = displayEvents(new Date(2001, 1, 1));
        assert.deepEqual(reDisplay, eventDisplay);
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
