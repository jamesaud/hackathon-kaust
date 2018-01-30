# hackathon-kaust

This was an Internet of Things 2 day hackathon!

See our Smart Doorbell in action in a video:

https://photos.app.goo.gl/Kc9ssPQjB1DFm3oz2

Here's a picture of what it looks like (click on the picture to see it rotated correctly):
![Alt text](/picture.jpg?raw=true "Doorbell")


## Technology 

ESP32 Microcontroller was used. I flashed an operating system called Mongoose OS which allows rapid prototyping in javascript.

MQTT messaging protocol was used to communicate with the WIFI enabled ESP32 Microcontroller.

It was a lot of fun developing this, my teammate generally did the hardware aspects of our product. None of this code is written well at all, secret keys are leaked, and bad coding practices are used... but awesome to be part of a hackathon :)
 ::

The 'serverr' folder has JS code which allowed us to send messages via Twilio:

https://github.com/jamesaud/hackathon-kaust/blob/master/serverr/mqtt-server.js

Microcontroller.js is what I wrote for our doorbell ringing software:

https://github.com/jamesaud/hackathon-kaust/blob/master/microcontroller.js

The screen software is custom firmware I write in C, but I don't have the code for that right now.

The Android App was a simple app I wrote to listen to doorbell events and notify the person that their doorbell was pushed (it is the first android app I ever wrote, so I was happy to see it work at all :) Give me a break on the coding aspects) :

https://github.com/jamesaud/hackathon-kaust/blob/master/androidapp/zepelin/app/src/main/java/com/example/zepelin/MainActivity.java

Also, I designed and 3d printed the boxes for our equipment in our makerspace lab :)


