import { SignJWT, jwtVerify } from "jose";
import { UserData } from "./constant";

const SECRET_KEY = new TextEncoder().encode(import.meta.env.VITE_SECRET_KEY);

export const createToken = async (uid: string, group: string, name: string, nickName: string) => {
  const payload = {
    uid,
    group,
    name,
    nickName
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1hr")
    .sign(SECRET_KEY);

  return token;
};

export const decodeToken = async (token: string): Promise<UserData> => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userData = payload as unknown as UserData; // Ensure the payload matches the UserData type
    return userData;
  } catch (error) {
    console.error("Invalid or expired token:", error);
    throw new Error("Invalid or expired token");
  }
};
