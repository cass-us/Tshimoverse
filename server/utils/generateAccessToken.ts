import jwt, { SignOptions } from "jsonwebtoken";

interface UserPayload {
  _id: string;
  jwt_secret: string;
}


const generateAccessToken = (user: UserPayload): string => {
  const jwtOptions: SignOptions = {
    expiresIn: "55m",
    issuer: "A-Team",
    audience: "API V1",
  };

  return jwt.sign(
    {
      id: user._id,
    },
    user.jwt_secret,
    jwtOptions
  );
};

export default generateAccessToken;
