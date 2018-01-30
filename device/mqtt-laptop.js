const mqtt = require('mqtt');
const player = require('play-sound')(opts = {});

const client  = mqtt.connect('mqtt://iot.eclipse.org');
const topic = '/zepelin/events';


client.on('connect', function () {
  client.subscribe(topic);
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  player.play('doorbell.mp3', function(err){if (err) console.log(err);});
});


