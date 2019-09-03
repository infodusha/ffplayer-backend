import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {type: String, trim: true},
  pic: mongoose.Schema.Types.ObjectId,
});

export default mongoose.model('User', userSchema);
