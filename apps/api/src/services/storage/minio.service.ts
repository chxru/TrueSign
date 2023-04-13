import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';

import { IStorageService } from './storage.interface';

export class MinioService implements IStorageService {
  private client: Client;

  constructor() {
    this.client = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minio',
      secretKey: 'minio123',
    });
  }

  async upload(props: {
    data: Buffer;
    directory: string;
    extension: string;
    filename?: string;
  }): Promise<void> {
    const content = Buffer.from(props.data);

    const name = props.filename || uuidv4() + '.' + props.extension;

    try {
      await this.client.putObject(props.directory, name, content);
    } catch (err) {
      console.log('Error in uploading minio', err);
      throw new Error('Error in uploading minio');
    }
  }
}
