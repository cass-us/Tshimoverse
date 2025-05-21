// src/models/User.ts
import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

// 1. ENUM for position
export enum Position {
  BI = 'BI',
  Admin = 'Admin',
  Manager = 'Manager',
  TeamLead = 'Team Lead',
  Beneficiary = 'Beneficiary',
}

// 2. IUser: just the schema fields (no Mongoose-specific stuff)
export interface IUser {
  username: string;
  email: string;
  password: string;
  position: Position;
  gender?: 'Male' | 'Female' | 'Other';
  programme?: string;
  cohortStartDate?: Date;
  cohortEndDate?: Date;
}

// 3. IUserDocument: combines IUser + Mongoose Document
export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 4. Define schema
const UserSchema = new Schema<IUserDocument>({
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
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: function (this: IUserDocument) {
      return this.position === Position.Beneficiary;
    },
  },
  programme: {
    type: String,
    required: function (this: IUserDocument) {
      return this.position === Position.Beneficiary;
    },
  },
  cohortStartDate: {
    type: Date,
    required: function (this: IUserDocument) {
      return this.position === Position.Beneficiary;
    },
  },
  cohortEndDate: {
    type: Date,
    required: function (this: IUserDocument) {
      return this.position === Position.Beneficiary;
    },
  },
});

// 5. Hash password before saving
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 6. Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 7. Create and export model
const User = mongoose.model<IUserDocument>('User', UserSchema);


export default User;
