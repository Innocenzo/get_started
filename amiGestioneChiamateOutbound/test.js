/**
 * port:  port server
 * host: host server
 * username: username for authentication
 * password: username's password for authentication
 * events: this parameter determines whether events are emited.
 **/
var _ = require('lodash');
var ami = new require('asterisk-manager')('5038','192.168.2.187','hello','world', true);
// In case of any connectiviy problems we got you coverd.
ami.keepConnected();

ami.on( 'managerevent',function (evt) {
    console.log(evt);
});
ami.action({
  Action: 'Setvar',
  ActionID: '123456789',
  Variable: 'DEVICE_STATE(Custom:DND_7015)',
  Value: 'BUSY'
},function (err,res) {
  if (err) {
      console.log(err);
  }
  console.log(res);
});
