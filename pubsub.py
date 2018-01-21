CREDENTIALS_PATH = 'service_account.json'
PROJECT_ID = 'superproject-192306'
TOPIC = 'zepelin'
SUBSCRIPTION = 'zepelin-sub'


def set_env():
    import os
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = CREDENTIALS_PATH


def explicit():
    from google.cloud import storage

    # Explicitly use service account credentials by specifying the private key
    # file.
    storage_client = storage.Client.from_service_account_json(
        'service_account.json')
    # Make an authenticated API request
    buckets = list(storage_client.list_buckets())
    print(buckets)


def publish():

    # Imports the Google Cloud client library
    from google.cloud import pubsub

    credentials = 'service_account.json'

    # Instantiates a client
    publisher = pubsub.PublisherClient()

    # # The resource path for the new topic contains the project ID
    # # and the topic name.
    topic_path = publisher.topic_path(PROJECT_ID, TOPIC)

    # Publish message
    publisher.publish(topic_path, b'My first message!', spam='eggs')


def subscribe():
    import os
    from google.cloud import pubsub

    subscriber = pubsub.SubscriberClient()

    topic_path = 'projects/{project_id}/topics/{topic}' \
        .format(project_id=PROJECT_ID, topic=TOPIC) # Set this to something appropriate.

    subscription_path = 'projects/{project_id}/subscriptions/{sub}' \
        .format(project_id=PROJECT_ID, sub=SUBSCRIPTION)  # Set this to something appropriate



    def callback(message):
         print(message)
         message.ack()

    subscription = subscriber.subscribe(subscription=subscription_path)
    future = subscription.open(callback=callback)
    print(future.result())


# Log into Google Cloud Client
set_env()
publish()
subscribe()




