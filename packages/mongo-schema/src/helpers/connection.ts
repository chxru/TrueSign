import { connect } from 'mongoose';

/**
 * Connect to MongoDB
 */
export const MongoDBConnect = async () => {
  const username = process.env['MONGO_USERNAME'];
  const password = process.env['MONGO_PASSWORD'];
  const host = process.env['MONGO_HOST'];

  if (!username) {
    throw new Error('MONGO_USERNAME not set');
  }

  if (!password) {
    throw new Error('MONGO_PASSWORD not set');
  }

  if (!host) {
    throw new Error('MONGO_HOST not set');
  }

  const uri = `mongodb+srv://${username}:${password}@${host}/prod?retryWrites=true&w=majority`;

  await connect(uri);
};
