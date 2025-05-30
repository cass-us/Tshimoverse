import mongoose, { Schema } from 'mongoose';

const ParticipationSchema = new Schema({
  beneficiaryId: { type: Schema.Types.ObjectId, ref: 'Beneficiary', required: true },
  programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
  role: { type: String, enum: ['participant', 'mentor', 'facilitator'], default: 'participant' },
  status: { type: String, enum: ['active', 'completed', 'withdrawn'], default: 'active' },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
}, { timestamps: true });

export default mongoose.model('Participation', ParticipationSchema);
