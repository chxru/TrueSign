import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

import { IStorageService } from './storage.interface';

export class S3Service implements IStorageService {
  private bucket: string;
  private client: S3Client;

  constructor() {
    this.bucket = process.env.bucket || 'truesignfyp-image-upload-bucket';
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
  }): Promise<void> {
    const content = Buffer.from(props.data);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: props.directory + '/' + uuidv4() + '.' + props.extension,
      Body: content,
    });

    try {
      await this.client.send(command);
    } catch (err) {
      console.log('Error in uploading s3', err);
      throw new Error('Error in uploading s3');
    }
  }
}
