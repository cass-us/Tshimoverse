import mongoose, { Document, Schema } from 'mongoose';

export enum Position {
  BI = 'BI',
  Developer = 'Developer',
  Manager = 'Manager',
  TeamLead = 'Team Lead',
}

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  position: Position;
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

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
