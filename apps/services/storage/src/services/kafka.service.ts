import { Admin, Kafka, Producer } from 'kafkajs';

export class KafkaService {
  private kafka: Kafka;
  private admin: Admin;
  private producer: Producer;

  constructor(clientId: string, brokers: string[]) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });

    this.admin = this.kafka.admin();
    this.producer = this.kafka.producer();

    this.createTopic('minio');
  }

  /**
   * Create a topic in kafka
   * @param topic
   */
  private async createTopic(topic: string) {
    try {
      const res = await this.admin.createTopics({
        topics: [
          {
            topic,
            numPartitions: 1,
          },
        ],
      });

      if (res) {
        console.log(`Topic ${topic} created`);
      } else {
        console.log(`Topic ${topic} already exists`);
      }
    } catch (error) {
      console.log('Error creating topic', error);
    }
  }

  public async start() {
    try {
      await this.producer.connect();
    } catch (error) {
      console.log('Error connecting to Kafka', error);
    }
  }

  public async send(topic: string, message: string) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: message,
          },
        ],
      });

      console.log(`Message ${message} to topic ${topic}`);
    } catch (error) {
      console.log('Error sending message to Kafka', error);
    }
  }

  public async stop() {
    try {
      await this.producer.disconnect();
    } catch (error) {
      console.log('Error disconnecting from Kafka', error);
    }
  }
}
