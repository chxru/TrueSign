import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const bucket = process.env.bucket || 'truesignfyp-image-upload-bucket';
const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'ap-southeast-1',
});

/**
 * Upload file to S3 bucket
 *
 * @param key upload directory
 * @param data
 */
const uploadFile = async (key: string, data: Buffer) => {
  const content = Buffer.from(data);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key + '/' + uuidv4(),
    Body: content,
  });

  try {
    await client.send(command);
  } catch (err) {
    console.log('Error in uploading s3', err);
    throw new Error('Error in uploading s3');
  }
};

export const s3 = {
  uploadFile,
};
