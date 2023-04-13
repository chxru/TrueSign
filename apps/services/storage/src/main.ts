import * as dotenv from 'dotenv';
import { initializeMinio } from './services/minio.service';

dotenv.config();

const main = async () => {
  try {
    await initializeMinio();
    console.log('[ ready ] minio');
  } catch (error) {
    console.log('[ error ] minio', error);
    process.exit(1);
  }

  process.exit(0);
};

main();
