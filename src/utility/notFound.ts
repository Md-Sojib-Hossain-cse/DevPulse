import type { Request, Response } from "express";
import sendResponse from "./sendResponse";

const notFound = (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 404,
    success: false,
    message: "Route Not Found",
  });
};

export default notFound;
