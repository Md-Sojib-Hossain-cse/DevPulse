import config from "../../config";
import { pool } from "../../db";
import AppError from "../../utility/appError";
import type { TAuth } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signUpUserIntoDB = async (payload: TAuth) => {
  const { name, email, password, role } = payload;
  const encodedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );

  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,role)
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,
    [name, email, encodedPassword, role ?? "contributor"],
  );

  if (result.rows[0]) {
    delete result.rows[0].password;
  }

  return result;
};

const loginUserFromDB = async (payload: Pick<TAuth, "email" | "password">) => {
  const { email, password } = payload;
  const userData = await pool.query(
    `
    SELECT * FROM users
    WHERE email=$1
    `,
    [email],
  );

  const user = userData.rows[0];

  if (!user) {
    throw new AppError(401, "Invalid Credentials!");
  }

  const decoded = await bcrypt.compare(password, user?.password);

  if (!decoded) {
    throw new AppError(401, "Invalid Credentials!");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.private_key as string, {
    expiresIn: "1d",
  });

  delete user.password;

  return { token, user };
};

export const authService = {
  signUpUserIntoDB,
  loginUserFromDB,
};
