import User, { Position } from '../models/User';
import HttpError from '../utils/httpError';

interface BulkUserInput {
  username: string;
  email: string;
  password?: string;
  position: Position;
  gender?: string;
  programme?: string;
  cohortStartDate?: string | Date;
  cohortEndDate?: string | Date;
}

const DEFAULT_PASSWORD = 'StrongPassword123!';

export const createMultipleUsers = async (users: BulkUserInput[]) => {
  if (!Array.isArray(users) || users.length === 0) {
    throw new HttpError('No users provided', 400);
  }

  const validPositions = Object.values(Position);

  const mappedUsers = users.map((user) => {
    const {
      username,
      email,
      password,
      position,
      gender,
      programme,
      cohortStartDate,
      cohortEndDate,
    } = user;

    if (!username || !email || !position) {
      throw new HttpError('Missing required fields: username, email, or position', 400);
    }

    if (!validPositions.includes(position)) {
      throw new HttpError(`Invalid role: ${position}`, 400);
    }

    const userPayload: any = {
      username: username.toLowerCase().replace(/\s+/g, ''),
      email: email.toLowerCase(),
      password: password || DEFAULT_PASSWORD,
      position,
    };

    if (position === Position.Beneficiary) {
      if (!gender || !programme || !cohortStartDate || !cohortEndDate) {
        throw new HttpError('Beneficiaries must have gender, programme, and cohort dates', 400);
      }

      Object.assign(userPayload, {
        gender,
        programme,
        cohortStartDate: new Date(cohortStartDate),
        cohortEndDate: new Date(cohortEndDate),
      });
    } else {
      if (gender) userPayload.gender = gender;
      if (programme) userPayload.programme = programme;
      if (cohortStartDate) userPayload.cohortStartDate = new Date(cohortStartDate);
      if (cohortEndDate) userPayload.cohortEndDate = new Date(cohortEndDate);
    }

    return userPayload;
  });

  // Use `save()` to trigger password hashing middleware
  const savedUsers = await Promise.all(
    mappedUsers.map(async (userData) => {
      const user = new User(userData);
      return await user.save(); // triggers password hashing
    })
  );

  return savedUsers;
};

// Optional dummy export to force module recognition
export {};
