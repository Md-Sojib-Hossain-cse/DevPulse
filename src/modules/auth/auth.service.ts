import config from "../../config";
import { pool } from "../../db";
import type { TAuth } from "./auth.interface";
import bcrypt from "bcrypt";

const registerUserIntoDB = async (payload: TAuth) => {
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

export const authService = {
  registerUserIntoDB,
};
