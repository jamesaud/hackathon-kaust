package com.example.zepelin;

import android.app.Notification;
import android.content.Intent;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.support.v4.app.NotificationCompat;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.Toast;

import org.eclipse.paho.client.mqttv3.IMqttMessageListener;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Calendar;


public class MainActivity extends AppCompatActivity {
    public static final String EXTRA_MESSAGE = "com.example.myfirstapp.MESSAGE";
    public static final List<Map<String, String>> mapList = new ArrayList<>();


    protected void onResume(){
        super.onResume();
        mqttTest();
    }

    protected void onStart(){
        super.onStart();
        mqttTest();
    }


    public void listView2Update(List<Map<String, String>> map_list){
        /*
        Pass in a map with key values:
            - type
            - message
         */
        List<Map<String, String>> data = new ArrayList<>();

        for (Map<String, String> map: map_list) {
            data.add(map);
        }

        final SimpleAdapter adapter = new SimpleAdapter(this, data,
                android.R.layout.simple_list_item_2,
                new String[] {"type", "message"},
                new int[] {android.R.id.text1,
                        android.R.id.text2});

        runOnUiThread(new Runnable() {
            public void run() {
                ListView listView = findViewById(R.id.listview);
                listView.setAdapter(adapter);
            }
        });
    }


    public void mqttTest(){

        String subtopic        = "/zepelin/events";
        int qos             = 2;
        String broker       = "tcp://iot.eclipse.org:1883";
        String clientId     = "JavaSample";
        MemoryPersistence persistence = new MemoryPersistence();


        try {
            MqttClient sampleClient = new MqttClient(broker, clientId, persistence);
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);

            System.out.println("Connecting to broker: "+broker);
            sampleClient.connect(connOpts);
            System.out.println("Connected");

            sampleClient.subscribe(subtopic, new IMqttMessageListener() {
                @Override
                public void messageArrived(String topic, MqttMessage message) throws Exception {
                    System.out.println("Message Arrived: "  + topic + " : " + message.toString());

                    JsonParser parser = new JsonParser();
                    JsonObject o = parser.parse(message.toString()).getAsJsonObject();
                    String type = o.get("type").toString();
                    type = type.substring(1, type.length() - 1); // Remove quotation marks

                    String msg = "";

                    if (type.equals("button")){
                        type = "buzzer"; //
                        msg = "Doorbell Is Ringing";
                    }
                    else{
                        msg = "Doorbell IR Sensor Triggered";
                    }

                    Date currentTime = Calendar.getInstance().getTime();

                    //listViewTest(items);
                    type = type.substring(0, 1).toUpperCase() + type.substring(1);
                    Map<String, String> map = new HashMap<>();
                    map.put("type", type + " - " + msg);
                    map.put("message", currentTime.toString());
                    mapList.add(map);
                    listView2Update(mapList);

                    createNotification(type, msg);

                }
            });
            System.out.println("Subscribing to : " + subtopic);
            /*
            sampleClient.disconnect();
            System.out.println("Disconnected");
            */
        } catch(MqttException me) {
            System.out.println("reason "+me.getReasonCode());
            System.out.println("msg "+me.getMessage());
            System.out.println("loc "+me.getLocalizedMessage());
            System.out.println("cause "+me.getCause());
            System.out.println("excep "+me);
            me.printStackTrace();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // MQTT
        this.mqttTest();
        this.listView2Update(mapList);
    }


    public void createNotification(String title, String subtitle){
        // Notification Bar
        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(this)
                        .setSmallIcon(R.drawable.notification_icon)
                        .setContentTitle(title)
                        .setContentText(subtitle);


        Intent resultIntent = new Intent(this, MainActivity.class);

        // Because clicking the notification opens a new ("special") activity, there's
        // no need to create an artificial back stack.
        PendingIntent resultPendingIntent =
                PendingIntent.getActivity(
                        this,
                        0,
                        resultIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT
                );

        mBuilder.setContentIntent(resultPendingIntent);
        //Uri alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        Uri sound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.doorbell);

        mBuilder.setSound(sound);

        mBuilder.setPriority(NotificationManager.IMPORTANCE_HIGH);
        mBuilder.setVisibility(Notification.VISIBILITY_PUBLIC);

        int mNotificationId = 001;

        // Gets an instance of the NotificationManager service
        NotificationManager mNotifyMgr = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        // Builds the notification and issues it.
        mNotifyMgr.notify(mNotificationId, mBuilder.build());
    }


    public void sendMessage(View view){

        /*
        // Service
        Intent intent = new Intent(this, MyService.class);
        startService(intent);
        System.out.println("Started service...");
        */

        final EditText editText = findViewById(R.id.editText);
        final String text = editText.getText().toString();
        editText.setText("");

        // Toast
        Toast.makeText(this, "Sending message...", Toast.LENGTH_SHORT).show();


        System.out.println("xxxxxxxxxxxxxxxxxxx");
        System.out.println(text);

        String topic        = "/zepelin/door";
        int qos             = 2;
        String broker       = "tcp://iot.eclipse.org:1883";
        String clientId     = "JavaSample";
        MemoryPersistence persistence = new MemoryPersistence();


        try {
            MqttClient sampleClient = new MqttClient(broker, clientId, persistence);
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);

            System.out.println("Connecting to broker: "+broker);
            sampleClient.connect(connOpts);
            System.out.println("Connected");


            MqttMessage message = new MqttMessage(text.getBytes());
            sampleClient.publish(topic, message);

            Toast.makeText(this, "Sent!", Toast.LENGTH_SHORT).show();


        } catch(MqttException me) {
            System.out.println("reason "+me.getReasonCode());
            System.out.println("msg "+me.getMessage());
            System.out.println("loc "+me.getLocalizedMessage());
            System.out.println("cause "+me.getCause());
            System.out.println("excep "+me);
            me.printStackTrace();
            Toast.makeText(this, "Failed to send :(", Toast.LENGTH_SHORT).show();

        }
    }

}
