import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

import { IStorageService } from './storage.interface';

export class S3Service implements IStorageService {
  private bucket: string;
  private client: S3Client;

  constructor() {
    if (!process.env.S3_BUCKET) {
      throw new Error('Bucket not found');
    }

    if (!process.env.AWS_ACCESS_KEY_ID) {
      throw new Error('AWS_ACCESS_KEY_ID not found');
    }

    if (!process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS_SECRET_ACCESS_KEY not found');
    }

    this.bucket = process.env.S3_BUCKET;
    this.client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: 'ap-southeast-1',
    });
  }

  async upload(props: {
    data: Buffer;
    directory: string;
    extension: string;
  }): Promise<string> {
    const content = Buffer.from(props.data);

    // remove trailing slash
    const directory = props.directory.replace(/\/$/, '');

    const filePath = directory + '/' + uuidv4() + '.' + props.extension;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
      Body: content,
    });

    try {
      await this.client.send(command);
      return filePath;
    } catch (err) {
      console.log('Error in uploading s3', err);
      throw new Error('Error in uploading s3');
    }
  }
}
