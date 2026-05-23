import type { NextFunction, Request, Response } from "express";
import type { TRole } from "../types";
import AppError from "../utility/appError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = (...roles: TRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.authorization;

      if (!token) {
        throw new AppError(401, "Unauthorized!");
      }

      const decodedToken = jwt.verify(token, config.private_key as string);

      if (!decodedToken) {
        throw new AppError(401, "Unauthorized!");
      }

      const userData = await pool.query(
        `
        SELECT * FROM users
        WHERE id=$1
        `,
        [(decodedToken as JwtPayload).id],
      );

      const user = userData.rows[0];

      if (!user) {
        throw new AppError(403, "Forbidden!");
      }

      if (roles.length && !roles.includes(user.role)) {
        throw new AppError(403, "Forbidden!");
      }

      req.user = decodedToken as JwtPayload;
      next();
    } catch (error) {
      throw new AppError(401, "Invalid or expired token!");
    }
  };
};

export default auth;
