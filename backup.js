load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');

let led = 13; //Cfg.get('pins.led');
let button = 21; 
let buzzer = 27;
let topic = '/zepelin/events';
print('LED GPIO:', led, 'button GPIO:', button);

let getInfo = function() {
  return JSON.stringify({
    total_ram: Sys.total_ram(),
    free_ram: Sys.free_ram()
  });
};

GPIO.set_mode(buzzer, GPIO.MODE_OUTPUT);

// Publish to MQTT topic on a button press. Button is wired to GPIO pin 0
GPIO.set_button_handler(button, GPIO.PULL_DOWN, GPIO.INT_EDGE_NEG, 200, function() {
  let message = getInfo();
  let ok = MQTT.pub(topic, message, 1);
  print("Published: ", ok);
  print(topic);
  GPIO.toggle(led);

  
  for (let i =1; i<101; i++){
    Timer.set(15*i, 0, function() {
        GPIO.toggle(buzzer);
    }, null)};
}, null);


GPIO.set_mode(ir_sensor, GPIO.MODE_INPUT);

Timer.set(100, Timer.REPEAT, function(){
  print(GPIO.read(ir_sensor));
}, null);





