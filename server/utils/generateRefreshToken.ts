import crypto from "crypto";

interface UserType {
  _id: string;
  
}

const generateRefreshToken = async (user: UserType): Promise<string> => {
  const random = crypto.randomBytes(64);
  const refreshToken = random.toString("hex");

  return refreshToken;
};

export default generateRefreshToken;
