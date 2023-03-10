import express from 'express';
import { initializeMinio } from './services/minio.service';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

initializeMinio()
  .then(() => {
    console.log('[ ready ] minio');

    app.listen(port, host, () => {
      console.log(`[ ready ] http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
