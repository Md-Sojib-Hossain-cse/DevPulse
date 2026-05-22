import type { NextFunction, Request, Response } from "express";
import { issuesService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const issuePayload = {
      ...req.body,
      reporter_id: req.user?.id,
    };
    const result = await issuesService.createIssueIntoDB(issuePayload);

    if (!result.rows[0]) {
      return sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Something went wrong!",
        data: null,
      });
    }

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await issuesService.getAllIssuesFromDB(req.query);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await issuesService.getSingleIssueFromDB(id as string);

    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue Not Found!",
        data: null,
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
};
