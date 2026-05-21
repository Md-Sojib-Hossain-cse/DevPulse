import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.registerUserIntoDB(req.body);
    if (!result.rows[0]) {
      return sendResponse(res, {
        success: false,
        statusCode: 500,
        message: "Something Went Wrong!",
        data: {},
      });
    }
    return sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User registered successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  registerUser,
};
