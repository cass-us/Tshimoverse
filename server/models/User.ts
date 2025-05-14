import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export enum Position {
  BI = 'BI',
  Developer = 'Developer',
  Manager = 'Manager',
  TeamLead = 'Team Lead',
 
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  position: Position;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    enum: Object.values(Position),
    required: true,
  },
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
