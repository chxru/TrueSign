import { MongoDBConnect } from '@truesign/mongo';
import cors from "cors";
import * as dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';

import { ClerkJWTValidator } from './middleware/clerk';

// routes
import attendanceRouter from './controllers/attendance.controller';
import imagesRouter from './controllers/images.controller';
import invitesRouter from './controllers/invite.controller';
import modulesRouter from './controllers/modules.controller';
import studentRouter from './controllers/students.controller';

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(fileUpload());
app.use(express.json());

// custom clerk middleware
app.use(ClerkJWTValidator);

// routes
app.use('/attendance', attendanceRouter);
app.use('/image', imagesRouter);
app.use('/invites', invitesRouter);
app.use('/modules', modulesRouter);
app.use('/students', studentRouter);

app.get('/healthcheck', (req, res) => {
  res.send({ status: 'ok' });
});

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
