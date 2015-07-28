//  EventManager.js
//  MVC Vote
//  Created by Giancarlo Mariot on 2015.
//  Copyright (c) 2015 Giancarlo Mariot. All rights reserved.
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Event Manager:

/**
 * @class        EventManager
 * @description  Manages the communication between Managers on behalf of each model-view-controller
 *               triad (MVC). Allows implementation of a publisher/subscriber pattern between each
 *               element of an MVC.
 * @constructor
 * @see          {@link http://www.scribd.com/doc/24130790/MVC-In-The-Browser|MVC in the Browser}
 */
var EventManager = EventManager || {
  notificationEvents:{},
  css: 'color:red;'
};

/**
 * @method       EventManager.register
 * @description  This method allows a Manager (MM,VM,CM) to register one of its managed element's
 *               event as publishable. A managed element is an element of an MVC triad.
 * @param        {string} managerName
 * @param        {string} eventName
 */
EventManager.register = function(managerName, eventName) {
  console.log('%cEventManager.register(<managerName:%s>, <eventName:%s>)\n', this.css, managerName, eventName);
  if (typeof(this.notificationEvents[managerName]) === 'undefined') {
    this.notificationEvents[managerName] = {};
  }
  if (typeof(this.notificationEvents[managerName][eventName]) === 'undefined') {
    this.notificationEvents[managerName][eventName] = [];
  } else {
    console.log('%cEvent \'%s\' is already defined', this.css, eventName);
  }
};

/**
 * @method       EventManager.unregister
 * @description  This method allows a Manager (MM,VM,CM) to unregister one of its managed element's
 *               event as publishable.
 * @param        {string} managerName
 * @param        {string} eventName
 */
EventManager.unregister = function(managerName, eventName) {
  if (this.notificationEvents[managerName][eventName].length > 0) {
    console.log("Can't unregister event " + eventName + " because it has subscribers");
    return 1;
  }
  console.log("Terminating event " + eventName);
  delete this.notificationEvents[managerName][eventName];
  if (Object.keys(this.notificationEvents[managerName]).length === 0) {
    console.log("Terminating manager entries for " + managerName);
    delete this.notificationEvents[managerName];
  }
  return 0;
};

/**
 * @method       EventManager.subscribe
 * @description  This method allows a subscriber (MM,VM,CM) to subscribe one of its managed
 *               element's to an event published by a publisher on behalf of that element. We
 *               specify the Manager object to route event notification towards the appropriate
 *               Manager.
 * @param        {string}  publisher
 * @param        {string}  eventName
 * @param        {Manager} manager
 */
EventManager.subscribe = function(publisher, eventName, manager) {
  console.log('%cEventManager.subscribe(<publisher:%s>, <eventName:%s>, <manager>)\n', this.css, publisher, eventName);
  if (typeof(this.notificationEvents[publisher][eventName]) === 'undefined') {
    console.log('event ' + eventName + ' is not defined.');
    return;
  }
  this.notificationEvents[publisher][eventName].push(manager);
};

/**
 * @method EventManager.unsubscribe 
 * TODO: test it!
 * unsubscribe(Manager im_unsubscriber, Manager im_publisher , String eventName)
 * This method will allow m_subscriber (MM,VM,CM) to unsubscribe one of its managed element's to an
 * event published by m_publisher on behalf of that element.We can see from the methods signature
 * that we pushed the complexity involved in the following type of questions:
 * • which element is registering an event;
 * • which element is subscribing to which element's event; back to the Manager implementation.
 * It seems better to have the respective Managers manage the individual mvc triad elements'
 * communication cycles.
 */
EventManager.unsubscribe = function(publisher, eventName, manager) {
  console.log('%cEventManager.unsubscribe(<publisher:%s>, <eventName:%s>, <manager>)\n', this.css, publisher, eventName);
  console.log("this.notificationEvents[publisher][eventName]", this.notificationEvents[publisher][eventName]);
  this.notificationEvents[publisher][eventName] = this.notificationEvents[publisher][eventName].filter(
    function(item) {
      if (item !== manager) {
        return item;
      }
    }
  );
  console.log("this.notificationEvents[publisher][eventName]", this.notificationEvents[publisher][eventName]);
};

/**
 * @method       EventManager.publish
 * @description  This method will allows a Manager (MM,VM,CM) to publish one of its managed
 *               element's event on behalf of that element. We specify the Manager object to route
 *               event notification towards the appropriate Manager.
 * @param        {string} publisher
 * @param        {string} eventName
 * @param        {array}  data
 */
EventManager.publish = function(publisher, eventName, data) {
  console.log('%cEventManager.publish(<publisher:%s>, <eventName:%s>, <data>)\n', this.css, publisher, eventName);
  if (typeof(this.notificationEvents[publisher]) === 'undefined') {
    console.error("%cUnknown publisher '%s'", this.css, publisher);
    return;
  }
  if (typeof(this.notificationEvents[publisher][eventName]) === 'undefined') {
    console.error("%cUnknown event '%s'", this.css, eventName);
    return;
  }
  this.notify(publisher, eventName, data);
};

/**
 * @method       EventManager.notify
 * @description  Triggers the ViewManager, ModelManager and ControllerManager's notify method.
 * @fires        Manager#notify
 * @param        {string} publisher
 * @param        {string} eventName
 * @param        {array}  data
 */
EventManager.notify = function(publisher, eventName, data) {
  console.log('%cEventManager.notify(<publisher:%s>, <eventName:%s>, <data>)\n', this.css, publisher, eventName);
  this.notificationEvents[publisher][eventName].forEach(function(item) {
    item.notify.call(item, publisher, eventName, data);
  });
};
