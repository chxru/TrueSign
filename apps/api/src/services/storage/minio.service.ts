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
  }): Promise<void> {
    const content = Buffer.from(props.data);

    try {
      await this.client.putObject(
        props.directory,
        uuidv4() + '.' + props.extension,
        content
      );
    } catch (err) {
      console.log('Error in uploading minio', err);
      throw new Error('Error in uploading minio');
    }
  }
}
