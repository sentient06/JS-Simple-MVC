//  MVC.js
//  MVC Vote
//  Created by Giancarlo Mariot on 2015.
//  Copyright (c) 2015 Giancarlo Mariot. All rights reserved.
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Default MVC classes:

/**
 * Generic MVC component.
 * @constructor
 */
var MVC = function(name) {
  this.type = 'MVC';
  this.name = name;
  this.css  = 'color:#CCC;';
};

/**
 * @method       MVC.registerEvent
 * @description  Registers an event in the Manager passing its component type for validation.
 * @abstract
 * @param        {string} eventName
 */
MVC.prototype.registerEvent = function(eventName) {
  console.log('%c%s.registerEvent(<eventName:%s>)', this.css, this.type, eventName);
  this.manager.register(this.type, eventName);
};

/**
 * @method       MVC.subscribeTo
 * @description  Forwards a subscription to the Manager.
 * @abstract
 * @param        {string}   publisher
 * @param        {string}   eventName
 * @param        {function} callback
 */
MVC.prototype.subscribeTo = function(publisher, eventName, callback) {
  console.log('%c%s.subscribeTo(<publisher:%s>, <eventName:%s>, <callback>)', this.css, this.type, publisher, eventName);
  var low = publisher.toLowerCase().substr(0,1);
  var pub = null;
  if (low === 'm') pub = 'Model';
  if (low === 'v') pub = 'View';
  if (low === 'c') pub = 'Controller';
  this.manager.subscribe(this.type, pub, eventName, callback);
};

/**
 * @method       MVC.publish
 * @description  Forwards a publication to the Manager.
 * @abstract
 * @param        {string} eventName
 */
MVC.prototype.publish = function(eventName) {
  console.log('%c%s.publish(<eventName:%s>)', this.css, this.type, eventName);
  var data = null;
  if (typeof(arguments[1]) !== 'undefined') {
    data = Array.prototype.slice.call(arguments, 1);
  }
  this.manager.publish(this.type, eventName, data);
};

/**
 * @method       MVC.unsubscribeFrom
 * @description  Forwards an unsubscription to the Manager.
 * @abstract
 * @param        {string} publisher
 * @param        {string} eventName
 */
MVC.prototype.unsubscribeFrom = function(publisher, eventName) {
  console.log('%c%s.unsubscribeFrom(<publisher:%s>, <eventName:%s>)', this.css, this.type, publisher, eventName);
  var low = publisher.toLowerCase().substr(0,1);
  var pub = null;
  if (low === 'm') pub = 'Model';
  if (low === 'v') pub = 'View';
  if (low === 'c') pub = 'Controller';
  this.manager.unsubscribe(this.type, pub, eventName);
};

/**
 * @method       MVC.unregisterEvent
 * @description  Unregisters an event from the Manager passing its component type for validation.
 * @abstract
 * @param        {string} eventName
 */
MVC.prototype.unregisterEvent = function(eventName) {
  console.log('%c%s.unregisterEvent(<eventName:%s>)', this.css, this.type, eventName);
  this.manager.unregister(this.type, eventName);
};

//-------------------------------------------------------------------------------------------------
// Specific MVC classes:

/**
 * @class        Model
 * @description  Basic model component.
 */
function Model(name) {
  MVC.call(this, name);
  this.type    = 'Model';
  this.css     = 'color:Orange;';
  this.manager = new ModelManager();
  console.log('%cNew %s called %s', 'color:#CCC;', this.type, this.name);
}
Model.prototype = Object.create(MVC.prototype);
Model.prototype.constructor = Model;

/**
 * @class        View
 * @description  Basic view component.
 */
function View(name) {
  MVC.call(this, name);
  this.type    = 'View';
  this.css     = 'color:blue;';
  this.manager = new ViewManager();
  console.log('%cNew %s called %s', 'color:#CCC;', this.type, this.name);
}
View.prototype = Object.create(MVC.prototype);
View.prototype.constructor = View;

/**
 * @class        Controller
 * @description  Basic controller component.
 */
function Controller(name) {
  MVC.call(this, name);
  this.type    = 'Controller';
  this.css     = 'color:green;';
  this.manager = new ControllerManager();
  console.log('%cNew %s called %s', 'color:#CCC;', this.type, this.name);
}
Controller.prototype = Object.create(MVC.prototype);
Controller.prototype.constructor = Controller;
