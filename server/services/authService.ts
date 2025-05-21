import User from "../models/User";
import HttpError from "../utils/httpError";

interface RegisterUserData {
  email: string;
  password: string;
  username: string;
  position: 'Admin' | 'Developer' | 'Manager' | 'Team Lead' | 'Beneficiary';
  gender?: string;
  programme?: string;
  cohortStartDate?: Date;
  cohortEndDate?: Date;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  programme?: string;
  gender?: string;
  cohortStartDate?: Date;
  cohortEndDate?: Date;
}

export const registerUser = async (userData: RegisterUserData) => {
  const {
    email,
    password,
    username,
    position,
    gender,
    programme,
    cohortStartDate,
    cohortEndDate,
  } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError("Email already exists", 409);
  }

  const userPayload: Record<string, any> = {
    email,
    password,
    username,
    position,
  };

  if (position === "Beneficiary") {
    if (!gender || !programme || !cohortStartDate || !cohortEndDate) {
      throw new HttpError("Missing beneficiary fields", 400);
    }

    Object.assign(userPayload, {
      gender,
      programme,
      cohortStartDate,
      cohortEndDate,
    });
  }

  const user = await User.create(userPayload);
  return user;
};

export const loginUser = async (credentials: LoginCredentials) => {
  const { email, password } = credentials;

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new HttpError("Incorrect email or password", 401);
  }

  return user;
};

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new HttpError("User not found", 404);
  }
  return user;
};

export const updateProfile = async (userId: string, data: UpdateUserData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  if (data.password) {
    user.password = data.password; // Assume hashing is handled in model middleware
  }

  for (const [key, value] of Object.entries(data)) {
    if (key !== "password" && value !== undefined) {
      (user as any)[key] = value;
    }
  }

  await user.save();
  return user;
};
