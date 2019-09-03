import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  title: {type: String, trim: true},
  text: {type: String, trim: true},
  date: {type: Date, default: Date.now},
});

export default mongoose.model('User', userSchema);
