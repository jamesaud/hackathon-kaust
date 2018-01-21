const mqtt = require('mqtt');
const express = require('express');
const app = express();

const client  = mqtt.connect('mqtt://iot.eclipse.org');
const topic = '/zepelin/events';

TWILIO_ACCOUNT_SID = 'ACb6ecdf19aa28ae89a9b187401fe17f48';
TWILIO_AUTH_TOKEN = '379569b9b26f80c0a29c17d292c62f5a';
TWILIO_PHONE_NUMBER = '+14849481379';
CELL_PHONE_NUMBER = '+18126502998';


client.on('connect', function () {
  client.subscribe(topic);
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());

  const client = require('twilio')(
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN
  );
  
  client.messages.create({
    from: TWILIO_PHONE_NUMBER,
    to: CELL_PHONE_NUMBER,
    body: "A Stranger is at your door!"
   // mediaUrl: 'http://www.themalaysiantimes.com.my/wp-content/uploads/2017/05/06-train-cat-shake-hands.jpg'
  }).then((messsage) => console.log(message.sid));

});

app.get("/"), (req, res) => {
  res.send("Hello world");
}

let port = process.env.PORT || 8080;

app.listen(port, () => console.log(`App started`));

