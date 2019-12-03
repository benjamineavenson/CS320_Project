import { Mongo } from 'meteor/mongo';

export const events = new Mongo.Collection('events');

export const users = new Mongo.Collection('users');