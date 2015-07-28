//  Manager.js
//  MVC Vote
//  Created by Giancarlo Mariot on 2015.
//  Copyright (c) 2015 Giancarlo Mariot. All rights reserved.
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Default Manager:

/**
 * Generic Manager class.
 * @constructor
 */
var Manager = function() {
  this.name = 'Manager';
  this.type = 'MVC';
  this.css  = 'color:grey;';
  this.events = {};
  this.subscriptions = {};
};

/**
 * @method       Manager.register
 * @description  Registers events under its own name. It keeps a list of registered events in
 *               memory and forwards a register to the Event Manager.
 * @param        {string} elementType
 * @param        {string} eventName
 */
Manager.prototype.register = function(elementType, eventName) {
  console.log('%c%s.register(<elementType:%s>, <eventName:%s>)', this.css, this.name, elementType, eventName);
  if (elementType === this.type) {
    if (typeof(this.events[eventName]) === 'undefined') {
      this.events[eventName] = [];
      EventManager.register(this.name, eventName);
    } else {
      console.log('%cEvent \'%s\' is already defined', this.css, eventName);
    }
  }
};

/**
 * @method       Manager.subscribe
 * @description  Subscribes a managed element under an event. The subscription list is kept in this
 *               object together with all the callbacks.
 * @param        {string}   subscriber
 * @param        {string}   publisher
 * @param        {string}   eventName
 * @param        {function} callback
 */
Manager.prototype.subscribe = function(subscriber, publisher, eventName, callback) {
  console.log('%c%s.subscribe(<subscriber:%s>, <publisher:%s>, <eventName:%s>, <callback>)', this.css, this.name, subscriber, publisher, eventName);
  subscriber += 'Manager';
  publisher += 'Manager';
  if (subscriber === this.name) {
    if (typeof(this.subscriptions[publisher]) === 'undefined')
      this.subscriptions[publisher] = {};
    if (typeof(this.subscriptions[publisher][eventName]) === 'undefined')
      this.subscriptions[publisher][eventName] = {};
    if (typeof(this.subscriptions[publisher][eventName][subscriber]) === 'undefined')
      this.subscriptions[publisher][eventName][subscriber] = callback;
    EventManager.subscribe(publisher, eventName, this);
  }
};

/**
 * @method       Manager.notify
 * @description  Notifies the managed elements by using their stored callbacks.
 * @param        {string} publisher
 * @param        {string} eventName
 * @param        {object} data
 */
Manager.prototype.notify = function(publisher, eventName, data) {
    console.log('%c%s.notify(<publisher:%s>, <eventName:%s>, <data>)', this.css, this.name, publisher, eventName);
    if (typeof(this.subscriptions[publisher]) === 'undefined') {
        console.log('%cNo publisher \'%s\' on %s', this.css, publisher, this.name);
        return;
    }
    var events = this.subscriptions[publisher][eventName];
    for (var publisherObject in events)
      if (events.hasOwnProperty(publisherObject))
        events[publisherObject].call(this, data);
};

/**
 * @method       Manager.publish
 * @description  Forwards a publication request to the Event Manager on behalf of a managed
 *               element.
 * @param        {string} elementType
 * @param        {string} eventName
 * @param        {object} data
 */
Manager.prototype.publish = function(elementType, eventName, data) {
    console.log('%cManager.publish(<elementType:%s>, <eventName:%s>, <data>)', this.css, elementType, eventName);
    if (elementType === this.type)
        EventManager.publish(this.name, eventName, data);
};

/**
 * @method       Manager.unsubscribe
 * @description  Unsubscribes a managed element under an event.
 * @param        {string} subscriber
 * @param        {string} publisher
 * @param        {string} eventName
 */
Manager.prototype.unsubscribe = function(subscriber, publisher, eventName) {
  console.log('%c%s.unsubscribe(<subscriber:%s>, <publisher:%s>, <eventName:%s>)', this.css, this.name, subscriber, publisher, eventName);
  subscriber += 'Manager';
  publisher += 'Manager';
  if (subscriber === this.name) {
    if (typeof(this.subscriptions[publisher][eventName][subscriber]) === 'undefined') {
      console.error('No such subscription');
      return;
    } else {
      delete this.subscriptions[publisher][eventName][subscriber];
    }
    EventManager.unsubscribe(publisher, eventName, this);
  }
};

/**
 * @method       Manager.unregister
 * @description  Registers events under its own name. It keeps a list of registered events in
 *               memory and forwards a register to the Event Manager.
 * @param        {string} elementType
 * @param        {string} eventName
 */
Manager.prototype.unregister = function(elementType, eventName) {
  console.log('%c%s.unregister(<elementType:%s>, <eventName:%s>)', this.css, this.name, elementType, eventName);
  if (elementType === this.type) {
    if (typeof(this.events[eventName]) === 'undefined') {
      console.error("No such event");
    } else {
      var errors = EventManager.unregister(this.name, eventName); // Any more than 0 is an error
      if (errors === 0)
        delete this.events[eventName];
    }
  }
};

//-------------------------------------------------------------------------------------------------
// Specific Managers:

/**
 * @class        ModelManager
 * @description  Basic Model Manager.
 */
function ModelManager() {
  Manager.call(this);
  this.name = 'ModelManager';
  this.type = 'Model';
  this.css  = 'color:orange;font-weight:bold;';
};
ModelManager.prototype = Object.create(Manager.prototype);
ModelManager.prototype.constructor = ModelManager;

/**
 * @class        ViewManager
 * @description  Basic View Manager.
 */
function ViewManager() {
  Manager.call(this);
  this.name = 'ViewManager';
  this.type = 'View';
  this.css  = 'color:blue;font-weight:bold;';
};
ViewManager.prototype = Object.create(Manager.prototype);
ViewManager.prototype.constructor = ViewManager;

/**
 * @class        ControllerManager
 * @description  Basic Controller Manager.
 */
function ControllerManager() {
  Manager.call(this);
  this.name = 'ControllerManager';
  this.type = 'Controller';
  this.css  = 'color:green;font-weight:bold;';
};
ControllerManager.prototype = Object.create(Manager.prototype);
ControllerManager.prototype.constructor = ControllerManager;
