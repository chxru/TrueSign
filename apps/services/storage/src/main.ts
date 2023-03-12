import express from 'express';
import { KafkaService } from './services/kafka.service';
import { IMinioWebhookBody, initializeMinio } from './services/minio.service';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = express();
app.use(express.json());

const kafka = new KafkaService('minio-express', ['localhost:9092']);

app.post('/', (req, res) => {
  const { Key } = req.body as IMinioWebhookBody;
  kafka.send('minio', Key);

  res.sendStatus(200);
});

const main = async () => {
  try {
    await initializeMinio();
    console.log('[ ready ] minio');
  } catch (error) {
    console.log('[ error ] minio', error);
  }

  try {
    await kafka.start();
    console.log('[ ready ] kafka');
  } catch (error) {
    console.log('[ error ] kafka', error);
  }

  try {
    await app.listen(port, host);
  } catch (error) {
    console.log('[ error ] express', error);
  }
};

main();
