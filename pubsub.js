/**
 * Created by jamesaudretsch on 1/17/18.
 */

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = 'service_account.json'

const projectId = 'superproject-192306';

// Imports the Google Cloud client library
const PubSub = require('@google-cloud/pubsub');

// The name for the topic
const topicName = 'zepelin';

// Subscription name
const subscription_name = 'zepelin-sub';

// Instantiates a client
const pubsub = new PubSub({
  projectId: projectId,
});

function getTopics(){
  // Creates the new topic
  pubsub
    .getTopics()
      .then(results => {
        const topics = results[0];

        console.log('Topics:');
        topics.forEach(topic => console.log(topic.name));
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
    // [END pubsub_list_topics]
  
  }


function publishMessage(topicName, data) {

  /**
   * TODO(developer): Uncomment the following lines to run the sample.
   */
  // const topicName = 'your-topic';
  // const data = JSON.stringify({ foo: 'bar' });

  // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
  const dataBuffer = Buffer.from(data);

  pubsub
    .topic(topicName)
    .publisher()
    .publish(dataBuffer)
    .then(results => {
      const messageId = results[0];
      console.log(`Message ${messageId} published.`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END pubsub_publish_message]
}


function listSubscriptions() {
  // [START pubsub_list_subscriptions]
  // Imports the Google Cloud client library
  const PubSub = require(`@google-cloud/pubsub`);

  // Creates a client
  const pubsub = new PubSub();

  // Lists all subscriptions in the current project
  pubsub
    .getSubscriptions()
    .then(results => {
      const subscriptions = results[0];

      console.log('Subscriptions:');
      subscriptions.forEach(subscription => console.log(subscription.name));
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END pubsub_list_subscriptions]
}


function getSubscription(subscriptionName) {
  // [START pubsub_get_subscription]
  // Imports the Google Cloud client library
  const PubSub = require(`@google-cloud/pubsub`);

  // Creates a client
  const pubsub = new PubSub();

  /**
   * TODO(developer): Uncomment the following line to run the sample.
   */
  // const subscriptionName = 'your-subscription';

  // Gets the metadata for the subscription
  pubsub
    .subscription(subscriptionName)
    .getMetadata()
    .then(results => {
      const metadata = results[0];

      console.log(`Subscription: ${metadata.name}`);
      console.log(`Topic: ${metadata.topic}`);
      console.log(`Push config: ${metadata.pushConfig.pushEndpoint}`);
      console.log(`Ack deadline: ${metadata.ackDeadlineSeconds}s`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END pubsub_get_subscription]
}

function listenForMessages(subscriptionName, timeout) {
  // [START pubsub_listen_messages]
  // Imports the Google Cloud client library

  /**
   * TODO(developer): Uncomment the following lines to run the sample.
   */
  // const subscriptionName = 'your-subscription';
  // const timeout = 60;

  // References an existing subscription
  const subscription = pubsub.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log("\tAttributes: %j", message.attributes);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on(`message`, messageHandler);
  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
  // [END pubsub_listen_messages]
}


/*
getTopics();
listSubscriptions();
*/

//getSubscription(subscription_name);
console.log("Running...")
console.log(getTopics());
listenForMessages(subscription_name, 1000000);
