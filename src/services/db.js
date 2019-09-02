import mongoose from 'mongoose';

/**
 * Connect to database
 * @return {Promise} connected
 */
export function connect() {
  return mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
}

export default mongoose.connection;
