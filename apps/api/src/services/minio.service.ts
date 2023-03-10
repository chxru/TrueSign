import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';

const client = new Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minio',
  secretKey: 'minio123',
});

/**
 * Upload file to minio instance
 *
 * @param key upload directory
 * @param data
 */
const uploadFile = async (key: string, data: Buffer, extension: string) => {
  const content = Buffer.from(data);

  try {
    await client.putObject(key, uuidv4() + '.' + extension, content);
  } catch (err) {
    console.log('Error in uploading minio', err);
    throw new Error('Error in uploading minio');
  }
};

export const minio = {
  uploadFile,
};
