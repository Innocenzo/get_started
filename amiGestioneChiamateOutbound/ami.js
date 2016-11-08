/**
 * port:  port server
 * host: host server
 * username: username for authentication
 * password: username's password for authentication
 * events: this parameter determines whether events are emited.
 **/
var _ = require('lodash');
var ami = new require('asterisk-manager')('5038','192.168.2.187','hello','world', true);
console.log('connection');
var callerList=['SIP/0000FFFF0001','SIP/0000FFFF0002','SIP/0000FFFF0001'];//,'SIP/0000FFFF0002','SIP/0000FFFF0001'
var agentList=new Map([["0000FFFF0003",{number:103,id:0,tec:'SIP',state:'NOT_INUSE'}]]);//,['SIP/0000FFFF0004',{number:103,id:1}]
// In case of any connectiviy problems we got you coverd.
ami.keepConnected();

// ami.on('devicestatechange', function() )
// Listen for any/all AMI events.
ami.on('managerevent', function(evt) {
  console.log(evt,'managerevent');
  if (evt.event==="DeviceStateChange" && callerList.length>0) {// NOTE: se gli agenti non sono utilizzati state='NOT_INUSE' questo va in un altro punto
     if (evt.state== 'NOT_INUSE') {
       var agent= _.split(evt.device, /[/-]/, 2);
       var agentFree= agent[1];
       var agentQueuePause=agent[0];
       if (agentList.has(agentFree) && agentQueuePause!=='Queue:support_pause_SIP') {
         console.log('****agent free****');
         console.log('*******',agentFree,'********',evt.device);
         var nextCall = _.last(callerList); // callerList[callerList.length - 1]
         callerList.pop();
          /**
           * pausa agente
           */
            console.log('prossima chiamata');
            console.log(agentFree,'pause free');
          // manda l'agente in pausa
          ami.action({
            Action: 'QueuePause',
            Interface: 'SIP/'+agentFree,
            Paused: true,
            Queue: 'support',
            Reason: 'ti mando una call'
          }, function(err, res) {
            if (err) {
              console.log(err,'queuepause');
            }
            console.log(res,'queuepause');
            var toCall = _.last(callerList);
            agentList.get(agentFree).state='INUSE';
            console.log(agentFree,'update');
            // quando so che l'utente è in pausa
            console.log(toCall,'toCall queuepause');
              ami.action({
                action:'originate',
                channel: nextCall,
                context:'LocalSets',
                exten:agentList.get(agentFree).number,// NOTE: agent che ho mandato in pausa (agentPause.number)
                priority:1,
                callerid: "Support Xenialab <1234>"
              }, function(err, res) {
                if (err) {
                  console.log(err,'originate');
                }
                console.log(res,'originate');
              } );
// ami.on('devicestatechange', function() )
// Listen for any/all AMI events.
ami.on('managerevent', function(evt) {
  console.log(evt,'managerevent');
  if (evt.event==="DeviceStateChange" && callerList.length>0) {// NOTE: se gli agenti non sono utilizzati state='NOT_INUSE' questo va in un altro punto
     if (evt.state== 'NOT_INUSE') {
       var agent= _.split(evt.device, /[/-]/, 2);
       var agentFree= agent[1];
       var agentQueuePause=agent[0];
       if (agentList.has(agentFree) && agentQueuePause!=='Queue:support_pause_SIP') {
         console.log('****agent free****');
         console.log('*******',agentFree,'********',evt.device);
         var nextCall = _.last(callerList); // callerList[callerList.length - 1]
         callerList.pop();
          /**
           * pausa agente
           */
            console.log('prossima chiamata');
            console.log(agentFree,'pause free');
          // manda l'agente in pausa
          ami.action({
            Action: 'QueuePause',
            Interface: 'SIP/'+agentFree,
            Paused: true,
            Queue: 'support',
            Reason: 'ti mando una call'
          }, function(err, res) {
            if (err) {
              console.log(err,'queuepause');
            }
            console.log(res,'queuepause');
            var toCall = _.last(callerList);
            agentList.get(agentFree).state='INUSE';
            console.log(agentFree,'update');
            // quando so che l'utente è in pausa
            console.log(toCall,'toCall queuepause');
              ami.action({
                action:'originate',
                channel: nextCall,
                context:'LocalSets',
                exten:agentList.get(agentFree).number,// NOTE: agent che ho mandato in pausa (agentPause.number)
                priority:1,
                callerid: "Support Xenialab <1234>"
              }, function(err, res) {
                if (err) {
                  console.log(err,'originate');
                }
                console.log(res,'originate');
              } );
          });
       }



     }
  }







  if (evt.event == 'QueueSummary') {
    console.log('Nome coda:  '+evt.queue,'status available:  '+evt.available);
    if (evt.queue=='support') {
      if (evt.available > 0) {
        var toCall = _.last(callerList); // callerList[callerList.length - 1]
        callerList.pop();
        /**
         * pausa agente
         */
         console.log(toCall,'toCall');
         console.log(callerList,"quanti sono rimasti");
         console.log(agentList);
         console.log(agentList.size);
         console.log(agentList.get("0000FFFF0003"),'get');

          // var agentPause=_.remove(agentList, function(value,index,array) {
          //   console.log(array);
          //   return value==array[0];
          // });

          var mapIter = agentList.keys();
          for (var i = 0; i < agentList.size; i++) { // NOTE: inizialmente manda a tutti gli agenti disponibili
            agentPause=mapIter.next().value;
            console.log(agentPause); // ["0000FFFF0003"]
          }

          console.log(agentPause,'pause');
        // manda l'agente in pausa
        console.log(toCall,'test');
        ami.action({
          Action: 'QueuePause',
          ActionID: '111111111',
          Interface: 'SIP/'+agentPause,
          Paused: true,
          Queue: 'support',
          Reason: 'ti mando una call'
        }, function(err, res) {
          if (err) {
            console.log(err,'queuepause');
          }
          console.log(res,'queuepause');
          agentList.get(agentPause).state='INUSE';
          console.log(agentList,'update');
          // quando so che l'utente è in pausa
          console.log(toCall,'toCall queuepause');
            ami.action({
              action:'originate',
              channel:toCall,
              context:'LocalSets',
              exten:agentList.get(agentPause).number,// NOTE: agent che ho mandato in pausa (agentPause.number)
              priority:1,
              callerid: "Support Xenialab <1234>"
            }, function(err, res) {
              if (err) {
                console.log(err,'originate');
              }
              console.log(res,'originate');

            } );
        });

      }

      // quando so che l'utente è in pausa
        // ami.action({
        //   action:'originate',
        //   channel:toCall[i],
        //   context:'LocalSets',
        //   exten:agentPause[0],
        //   callerid: "Support Xenialab <1234>"
        // }, function(err, res) {
        //   if (err) {
        //     console.log(err);
        //   }
        //   console.log(res);
        // });

      // chimate passate alla coda
      // for (var i = 0; i < evt.available; i++) {
      //   console.log(i);
      //
      //   console.log(toCall[i],'da chiamare');
      //   ami.action({
      //     action:'originate',
      //     channel:toCall[i],
      //     context:'LocalSets',
      //     exten:7001,
      //     priority:1,
      //     callerid: "Support Xenialab <1234>"
      //   }, function(err, res) {
      //     if (err) {
      //       console.log(err);
      //     }
      //     console.log(res);
      //   });
      // }
    }

  }
});

// Listen for specific AMI events. A list of event names can be found at
// https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Events
ami.on('hangup', function(evt) {
  console.log(evt,'hangup');
  var agentUnpause=_.split(evt.channel, /[-/]/,2)[1];
  if (agentList.has(agentUnpause)) {
    ami.action({
      Action: 'QueuePause',
      ActionID: '666111111111',
      Interface: 'SIP/'+agentUnpause,
      Paused: false,
      Queue: 'support',
      Reason: 'uscita'
    }, function(err, res) {
      if (err) {
        console.log(err,'queuepause');
      }
      console.log(res,'hangup Unpause');
  });
  }
});
ami.on('confbridgejoin', function(evt) {
  console.log(evt,'confbridgejoin');
});

// Listen for Action responses.
ami.on('response', function(evt) {
  console.log(evt,'response');
});

// Perform an AMI Action. A list of actions can be found at
// https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Actions
// ami.action({
//   'action':'originate',
//   'channel':'SIP/myphone',
//   'context':'default',
//   'exten':1234,
//   'priority':1,
//   'variable':{
//     'name1':'value1',
//     'name2':'value2'
//   }
// }, function(err, res) {});
// ami.action({
//   'action':'originate',
//   'channel':'SIP/0000FFFF0001',
//   'context':'LocalSets',
//   'exten':102,
//   'priority':1,
//   'callerid': "Enzo Biondo <1234>"
// }, function(err, res) {
//   if (err) {
//     console.log(err);
//   }
//   console.log(res);
// });
// ListCommands

ami.action({
  action:'queuesummary'
}, function(err, res) {
  if (err) {
    console.log(err);
  }
  console.log(res);
});
          });
       }



     }
  }







  if (evt.event == 'QueueSummary') {
    console.log('Nome coda:  '+evt.queue,'status available:  '+evt.available);
    if (evt.queue=='support') {
      if (evt.available > 0) {
        var toCall = _.last(callerList); // callerList[callerList.length - 1]
        callerList.pop();
        /**
         * pausa agente
         */
         console.log(toCall,'toCall');
         console.log(callerList,"quanti sono rimasti");
         console.log(agentList);
         console.log(agentList.size);
         console.log(agentList.get("0000FFFF0003"),'get');

          // var agentPause=_.remove(agentList, function(value,index,array) {
          //   console.log(array);
          //   return value==array[0];
          // });

          var mapIter = agentList.keys();
          for (var i = 0; i < agentList.size; i++) { // NOTE: inizialmente manda a tutti gli agenti disponibili
            agentPause=mapIter.next().value;
            console.log(agentPause); // ["0000FFFF0003"]
          }

          console.log(agentPause,'pause');
        // manda l'agente in pausa
        console.log(toCall,'test');
        ami.action({
          Action: 'QueuePause',
          ActionID: '111111111',
          Interface: 'SIP/'+agentPause,
          Paused: true,
          Queue: 'support',
          Reason: 'ti mando una call'
        }, function(err, res) {
          if (err) {
            console.log(err,'queuepause');
          }
          console.log(res,'queuepause');
          agentList.get(agentPause).state='INUSE';
          console.log(agentList,'update');
          // quando so che l'utente è in pausa
          console.log(toCall,'toCall queuepause');
            ami.action({
              action:'originate',
              channel:toCall,
              context:'LocalSets',
              exten:agentList.get(agentPause).number,// NOTE: agent che ho mandato in pausa (agentPause.number)
              priority:1,
              callerid: "Support Xenialab <1234>"
            }, function(err, res) {
              if (err) {
                console.log(err,'originate');
              }
              console.log(res,'originate');

            } );
        });

      }

      // quando so che l'utente è in pausa
        // ami.action({
        //   action:'originate',
        //   channel:toCall[i],
        //   context:'LocalSets',
        //   exten:agentPause[0],
        //   priority:1,
        //   callerid: "Support Xenialab <1234>"
        // }, function(err, res) {
        //   if (err) {
        //     console.log(err);
        //   }
        //   console.log(res);
        // });

      // chimate passate alla coda
      // for (var i = 0; i < evt.available; i++) {
      //   console.log(i);
      //
      //   console.log(toCall[i],'da chiamare');
      //   ami.action({
      //     action:'originate',
      //     channel:toCall[i],
      //     context:'LocalSets',
      //     exten:7001,
      //     priority:1,
      //     callerid: "Support Xenialab <1234>"
      //   }, function(err, res) {
      //     if (err) {
      //       console.log(err);
      //     }
      //     console.log(res);
      //   });
      // }
    }

  }
});

// Listen for specific AMI events. A list of event names can be found at
// https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Events
ami.on('hangup', function(evt) {
  console.log(evt,'hangup');
  var agentUnpause=_.split(evt.channel, /[-/]/,2)[1];
  if (agentList.has(agentUnpause)) {
    ami.action({
      Action: 'QueuePause',
      ActionID: '666111111111',
      Interface: 'SIP/'+agentUnpause,
      Paused: false,
      Queue: 'support',
      Reason: 'uscita'
    }, function(err, res) {
      if (err) {
        console.log(err,'queuepause');
      }
      console.log(res,'hangup Unpause');
  });
  }
});
ami.on('confbridgejoin', function(evt) {
  console.log(evt,'confbridgejoin');
});

// Listen for Action responses.
ami.on('response', function(evt) {
  console.log(evt,'response');
});

// Perform an AMI Action. A list of actions can be found at
// https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Actions
// ami.action({
//   'action':'originate',
//   'channel':'SIP/myphone',
//   'context':'default',
//   'exten':1234,
//   'priority':1,
//   'variable':{
//     'name1':'value1',
//     'name2':'value2'
//   }
// }, function(err, res) {});
// ami.action({
//   'action':'originate',
//   'channel':'SIP/0000FFFF0001',
//   'context':'LocalSets',
//   'exten':102,
//   'priority':1,
//   'callerid': "Enzo Biondo <1234>"
// }, function(err, res) {
//   if (err) {
//     console.log(err);
//   }
//   console.log(res);
// });
// ListCommands

ami.action({
  action:'queuesummary'
}, function(err, res) {
  if (err) {
    console.log(err);
  }
  console.log(res);
});
