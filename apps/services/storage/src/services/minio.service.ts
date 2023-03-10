import { Client } from 'minio';

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

export const initializeMinio = async () => {
  await Promise.all(buckets.map(createBucket));
};
