load('api_config.js');
load('api_mqtt.js');
load('api_timer.js');
load('api_dht.js');
load('api_gpio.js');
load('api_net.js');
load('api_sys.js');



let deviceName = Cfg.get('device.id');
let topic = '/devices/' + deviceName + '/events';
print('Topic: ', topic);

let isConnected = false;
let pin = 4;

let getInfo = function() {
  return JSON.stringify({
    total_ram: Sys.total_ram() / 1024,
    free_ram: Sys.free_ram() / 1024,
    t: Sys.uptime()
  });
};


// on button press try to publish
GPIO.set_mode(pin, GPIO.MODE_INPUT);
GPIO.set_pull(pin, GPIO.PULL_DOWN);

GPIO.set_button_handler(pin, GPIO.PULL_DOWN, GPIO.INT_EDGE_NEG, 200, function() {
  if( ! isConnected ){
    print('MQTT not connected');
  } else {
    let msg = getInfo();
    let ok = MQTT.pub(topic, msg, 1);

    print('MQTT message', (ok ? '' : 'not'), 'published');
  }
}, null);

// print info to console every 5 seconds
Timer.set(
  5000,  true,  function() {
    print('Info:', getInfo());
  },
  null
);


// print MQTT events to console and publish on connect
MQTT.setEventHandler(function(conn, ev) {
  if (ev === MQTT.EV_CONNACK) {
    print('MQTT CONNECTED');
    isConnected=true;
  } 
}, null);


// publish
function publishData() {
  let ok = MQTT.pub(topic, getInfo());
  if (ok) {
    print('Published successfully');
  } else {
    print('Error publishing');
  }
}

// Monitor network connectivity.
Net.setStatusEventHandler(function(ev, arg) {
  let evs = '???';
  if (ev === Net.STATUS_DISCONNECTED) {
    evs = 'DISCONNECTED';
  } else if (ev === Net.STATUS_CONNECTING) {
    evs = 'CONNECTING';
  } else if (ev === Net.STATUS_CONNECTED) {
    evs = 'CONNECTED';
  } else if (ev === Net.STATUS_GOT_IP) {
    evs = 'GOT_IP';
  }
  print('== Net event:', ev, evs);
}, null);
