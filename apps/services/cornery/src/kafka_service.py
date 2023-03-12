from confluent_kafka import Consumer

kafka_config = {
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'cornery',
    'auto.offset.reset': 'earliest'
}


class KafkaService:
    """Initiate connection to Kafka and consume messages from a topic."""
    __consumer: Consumer = None
    __topic: str = None
    __on_message: callable = None

    def __init__(self, topic: str, on_message: callable) -> None:
        """Initiate connection to Kafka and consume messages from a topic.

        Args:
            topic (str): Kafka topic to consume messages from.
            on_message (callable): Function to call when a message is received.


        """
        self.__consumer = Consumer(kafka_config)
        self.__topic = topic
        self.__on_message = on_message

    def consume(self):
        self.__consumer.subscribe([self.__topic])
        while True:
            msg = self.__consumer.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                print("Consumer error: {}".format(msg.error()))
                continue
            print('Received message: {}'.format(msg.value().decode('utf-8')))
            self.__on_message(msg.value().decode('utf-8'))

    def close(self):
        self.__consumer.close()
