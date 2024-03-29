import {
  Client,
  NotificationConfig,
  ObjectCreatedAll,
  QueueConfig,
} from 'minio';

/**
 * Minio webhook body
 * Note: This is not the full body, just the parts we need
 */
export interface IMinioWebhookBody {
  /**
   * The name of the event
   * @example s3:ObjectCreated:Put
   * @see https://min.io/docs/minio/linux/reference/minio-mc/mc-event-add.html#supported-bucket-events
   */
  EventName: string;
  /**
   * Path to the object
   */
  Key: string;
}

const client = new Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minio',
  secretKey: 'minio123',
});

const buckets: string[] = ['upload', 'dev'];

const createBucket = async (bucket: string) => {
  const exists = await client.bucketExists(bucket);
  if (!exists) {
    await client.makeBucket(bucket);
  }
};

const subscribeToKafka = async () => {
  const arn = 'arn:minio:sqs::CONFLUENT:kafka';

  const queue = new QueueConfig(arn);
  queue.addEvent(ObjectCreatedAll);

  const config = new NotificationConfig();
  config.add(queue);

  await client.setBucketNotification('upload', config);
};

export const initializeMinio = async () => {
  await Promise.all(buckets.map(createBucket));
  await subscribeToKafka();
};
