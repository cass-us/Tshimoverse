import mongoose, { Schema } from 'mongoose';

const InvitationSchema = new Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Invitation', InvitationSchema);
