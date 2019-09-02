import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  img: {data: Buffer, contentType: String},
});

export default mongoose.model('Image', imageSchema);
