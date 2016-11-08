'use strict';

var Ami = require('asterisk-manager');
var _ = require('lodash');
var moment = require('moment');

var BPromise = require('bluebird');

var ami = new Ami('5038', '192.168.2.95', 'xcall', 'xcall1234', true);

var phones = {
    'venere1': {
        channel: 'SIP/venere1',
        name: 'Venere 1',
        lock: false,
        retry: 3,
        frequency: 5,
        lastCallAt: null
    },
    'john.doe': {
        channel: 'SIP/john.doe',
        name: 'Jonh Doe',
        lock: false,
        retry: 3,
        frequency: 5,
        lastCallAt: null
    }
};

var countPhones = 2;

var configQueue = [{
    queue: 'Support',
    retry: 3,
    timeout: 5
}];

var actions = [];

var selectedQueues = _.map(configQueue, 'queue'); // [Support]

var queues = {};
var loop = false;

function addPhone(key, value) {
    phones[key] = value;
    countPhones += 1;
    if (countPhones === 1) {
        loop = true;
    }
}

function deletePhone(index) {
    delete phones[index];
    countPhones -= 1;
}

// In case of any connectiviy problems we got you coverd.
ami.keepConnected();

// Listen for any/all AMI events.
ami.on('managerevent', function(evt) {
    // console.log('managerevent', evt);
});

// ARRIVA SOLO LA PRIMA VOLTA
ami.on('queuemember', function(evt) {

    if (_.includes(selectedQueues, evt.queue)) {
        console.log('queuemember', evt);

        if (!queues[evt.queue]) {
            queues[evt.queue] = {};
        }

        queues[evt.queue][evt.location] = evt;
        queues[evt.queue][evt.location].interface = evt.location;
        queues[evt.queue][evt.location].membername = evt.name;
    }

});

ami.on('queuememberstatus', function(evt) {

    if (_.includes(selectedQueues, evt.queue)) {
        loop = true;
        console.log('queuememberstatus', evt);

        if (!queues[evt.queue]) {
            queues[evt.queue] = {};
        }

        queues[evt.queue][evt.interface] = evt;
    }
});

ami.on('queuememberpause', function(evt) {

    if (_.includes(selectedQueues, evt.queue)) {
        loop = true;
        console.log('queuememberpause', evt);

        if (!queues[evt.queue]) {
            queues[evt.queue] = {};
        }

        queues[evt.queue][evt.interface] = evt;
    }


});

ami.on('queuestatuscomplete', function(evt) {
    // NOTE: quando lanci l'azione queuestatus e asterisk termina i queuemember
    loop = true;
});

ami.on('originateresponse', function(evt) {
    console.log(evt);

    _.remove(actions, function(value) {
        return value === evt.actionid;
    });

    var phone = _.split(evt.channel, /[/-]/, 3);
    console.log(phone);
    console.log(phones[phone[1]]);

    phones[phone[1]].retry -= 1;

    if (evt.response === 'Failure') {
        if (phones[phone[1]].retry === 0) {
            deletePhone(phone[1]);
        } else {
            phones[phone[1]].lock = false;
        }

    } else {
        console.log('SUCCESS');
        deletePhone(phone[1]);
    }

    if (actions.length === 0) {
        loop = true;
    }
});


ami.on('hangup', function(evt) {});

ami.action({
    action: 'queuestatus'
});

var action = BPromise.promisify(ami.action);

var filteredPhones = [];

setInterval(function() {
    if (loop) {
        // Ho agenti liberi?
        for (var key in queues) {
            if (queues.hasOwnProperty(key)) {
                // console.log('queuename', key);
                // console.log('queueobj', queues[key]);
                var filteredAgentFree = _.filter(queues[key], {
                    status: '1'
                });

                console.log('agent ready', filteredAgentFree.length);

                for (var i = 0; i < filteredAgentFree.length; i += 1) {

                    filteredPhones = _.filter(phones, function(value, index) {
                        var diff = value.frequency;
                        if (value.lastCallAt) {
                            diff = moment().diff(value.lastCallAt, 'seconds');
                        }
                        console.log('diff', diff, 'index', index);
                        return value.lock === false && diff >= value.frequency;
                    });

                    console.log('phones Available', filteredPhones.length);

                    for (var j = 0; j < filteredPhones.length && j < filteredAgentFree.length; j += 1) {

                        filteredPhones[j].lock = true;
                        filteredPhones[j].lastCallAt = moment();

                        var originate = {
                            'action': 'originate',
                            'channel': filteredPhones[j].channel,
                            'context': 'from-sip',
                            'exten': filteredAgentFree[i].membername,
                            'priority': 1,
                            'async': true
                        };

                        console.log(originate);

                        action(originate)
                            .then(function(res) {
                                actions.push(res.actionid);
                            })
                            .catch(function(err) {
                                console.error('ko', err);
                            });
                    }
                }
            }
        }

        if (filteredPhones.length > 0 || countPhones === 0) {
            loop = false;
        }

    }


}, 1000);


setTimeout(function() {
    addPhone('venere1', {
        channel: 'SIP/venere1',
        name: 'Venere 1',
        lock: false,
        retry: 3,
        frequency: 5,
        lastCallAt: null
    });
}, 17000);
// ami.action({
//   'action':'originate',
//   'channel':'SIP/giuseppe.careri',
//   'context':'from-sip',
//   'exten':600,
//   'priority':1,
//   'variable':{
//     'name1':'value1',
//     'name2':'value2'
//   }
// }, function(err, res) {
//   console.log(err);
//   console.log(res);
// });
