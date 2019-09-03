import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  rate: {type: Number, default: 0, min: 0, max: 10, required: true},
  rank: {type: String, default: 'MASTER', uppercase: true, required: true},
  streamer: {type: Boolean, required: true},
  games: {type: [String], required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, index: true, required: true},
});

export default mongoose.model('Trainer', trainerSchema);
