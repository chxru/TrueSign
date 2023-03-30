import { MongoDBConnect } from '@truesign/mongo';
import * as dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';

// routes
import imagesRouter from './controllers/images.controller';

const app = express();

// middleware
app.use(fileUpload());

// routes
app.use('/image', imagesRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

dotenv.config();

const port = process.env.PORT || 3333;

const main = async () => {
  try {
    // initialize database connection
    await MongoDBConnect();
    console.log('Connected to MongoDB');

    // start server
    await app.listen(port);
    console.log(`Listening at http://localhost:${port}/`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
};

main();
