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

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

server.on('error', console.error);
