//  Main.js
//  MVC Vote
//  Created by Giancarlo Mariot on 2015.
//  Copyright (c) 2015 Giancarlo Mariot. All rights reserved.
//-------------------------------------------------------------------------------------------------

// The code below is messy, but is just a test anyway.

(function(){ "use strict"; var doc = document;
doc.addEventListener('DOMContentLoaded', function() {

//-------------------------------------------------------------------------------------------------
console.log("Hi, the main source for this code is here:%c http://www.scribd.com/doc/24130790/MVC-In-The-Browser", 'color:blue;');
console.log("Also, check this one ....................:%c http://www.dofactory.com/javascript/observer-design-pattern", 'color:blue;');
console.log("Wikipedia, for the sake of it ...........:%c https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller", 'color:blue;');
console.log("And Mozilla's website is well useful ....:%c https://developer.mozilla.org/en-US/docs/Web/JavaScript", 'color:blue;');
console.log("Unknown author for the first two =(");
//-------------------------------------------------------------------------------------------------

var bar = '';
for (var i = 0; i < 100; i++)
    bar += '\u2500';
console.log(bar);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The view v1 registers , through its VM, a « YES_BUTTON_CLICKED » event with the EM.
// The view v2 registers , through its VM, a «  NO_BUTTON_CLICKED » event with the EM.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v1 = new View('v1');
var v2 = new View('v2');

v1.registerEvent('YES_BUTTON_CLICKED');
v2.registerEvent('NO_BUTTON_CLICKED');

console.log(bar);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The model m registers a «INC_Y_VOTES» and a « INC_NO_VOTES» events with the EM throughits MM.
// ( <- last line )
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var m = new Model('m');
m.votes_yes = 0;
m.votes_no = 0;
m.dummy_api_call = function(votes, callback) {
    console.log('Here we pretend to have something being done in a remote server and returning something.');
    console.log('There is a configurable delay. Check line 42.');
    // Here we use a callback to simulate an assynchronous call:
    setTimeout(function(){callback(votes+1);}, 0); // Change delay here to test it.
};

m.registerEvent('INC_Y_VOTES');
m.registerEvent('INC_NO_VOTES');

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The view v1, which displays the number of 'yes' votes subscribes to the « INC_Y_VOTES  » event of
// the model representing the number of votes.
// The view v2, which displays the number of 'no'  votes subscribes to the « INC_NO_VOTES » event of
// the model representing the number of votes.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

v1.subscribeTo('m', 'INC_Y_VOTES', function(data) {
    console.log('%c%s received INC_Y_VOTES  notification with following data:', v1.css, v1.name, data);
    document.getElementById("results_yes").innerHTML = data[0];
});

v2.subscribeTo('m', 'INC_NO_VOTES', function(data) {
    console.log('%c%s received INC_NO_VOTES notification with following data:', v2.css, v2.name, data);
    document.getElementById("results_no").innerHTML = data[0];
});

console.log(bar);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Now let's have a controller c1 interested in the «YES_BUTTON_CLICKED» event subscribe, through
// its CM and the EM, to that event.
// The controller c1 registers, through its VM, a « VOTED_YES » event with the EM.
// Now let's have a controller c2 interested in the « NO_BUTTON_CLICKED» event subscribe, through
// its CM and the EM, to that event.
// The controller c2 registers, through its VM, a « VOTED_NO  » event with the EM.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var c1 = new Controller('c1');
var c2 = new Controller('c2');

c1.registerEvent('VOTED_YES');
c2.registerEvent('VOTED_NO');

c1.subscribeTo('v', 'YES_BUTTON_CLICKED', function(data) {
    console.log('%c%s received YES_BUTTON_CLICKED notification with following data:', c1.css, c1.name, data);
    c1.publish('VOTED_YES');
});
c2.subscribeTo('v', 'NO_BUTTON_CLICKED', function(data) {
    console.log('%c%s received NO_BUTTON_CLICKED  notification with following data:', c2.css, c2.name, data);
    c1.publish('VOTED_NO');
});

console.log(bar);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Furthermore, let a model m that represents both the number of 'yes' votes and the number of 'no'
// votes, subscribe to the « VOTED_YES » and « VOTED_NO » events through its MM and the EM.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

m.subscribeTo('c', 'VOTED_YES', function(data) {
    console.log('%c%s received VOTED_YES notification with following data:', m.css, m.name, data);
    // It takes 3 seconds to publish a "yes" vote. How suspicious!
    m.dummy_api_call(m.votes_yes, function(votes) {
        m.votes_yes = votes;
        m.publish('INC_Y_VOTES', m.votes_yes);
    });    
});
m.subscribeTo('c', 'VOTED_NO', function(data) {
    console.log('%c%s received VOTED_NO  notification with following data:', m.css, m.name, data);
    m.dummy_api_call(m.votes_no, function(votes) {
        m.votes_no = votes;
        m.publish('INC_NO_VOTES', m.votes_no);
    }); 
});

console.log(bar);
console.log(bar);

//-------------------------------------------------------------------------------------------------
// Binding HTML:


// Buttons (it's an anchor, really)
v1.clickButton = function() {
    this.publish('YES_BUTTON_CLICKED');
};
v2.clickButton = function() {
    this.publish('NO_BUTTON_CLICKED');
};

// Voting anchors:
document.getElementById("anchor_yes").onclick = function() {
    v1.clickButton();
};
document.getElementById("anchor_no").onclick = function() {
    v2.clickButton();
};

// Remove stuff:

var removeYesListeners = function() {
    v1.unsubscribeFrom('m', 'INC_Y_VOTES');
    c1.unsubscribeFrom('v', 'YES_BUTTON_CLICKED');
     m.unsubscribeFrom('c', 'VOTED_YES');
};

var removeNoListeners =  function() {
    v2.unsubscribeFrom('m', 'INC_NO_VOTES');
    c2.unsubscribeFrom('v', 'NO_BUTTON_CLICKED');
     m.unsubscribeFrom('c', 'VOTED_NO');
};

var removeYesPublishers = function() {
    v1.unregisterEvent('YES_BUTTON_CLICKED');
    c1.unregisterEvent("VOTED_YES");
     m.unregisterEvent("INC_Y_VOTES");
};

var removeNoPublishers =  function() {
    v2.unregisterEvent('NO_BUTTON_CLICKED');
    c2.unregisterEvent("VOTED_NO");
     m.unregisterEvent("INC_NO_VOTES");
};

var removeListeners = function() {
    removeYesListeners();
    removeNoListeners();
};

var removePublishers = function() {
    removeYesPublishers();
    removeNoPublishers();
};

// Removal anchors:

document.getElementById("anchor_listeners").onclick = function() {
    removeListeners();
};
document.getElementById("anchor_publishers").onclick = function() {
    removePublishers();
};
document.getElementById("anchor_stop").onclick = function() {
    removeListeners();
    removePublishers();
};
document.getElementById("anchor_stop_yes").onclick = function() {
    removeYesListeners();
    removeYesPublishers();
};
document.getElementById("anchor_stop_no").onclick = function() {
    removeNoListeners();
    removeNoPublishers();
};

// Default:

document.getElementById("results_yes").innerHTML = "0";
document.getElementById("results_no").innerHTML = "0";


},false);
})();
