import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../auth/auth.consts";

const router = Router();

router.post(
  "/",
  auth(USER_ROLES.contributor, USER_ROLES.maintainer),
  issuesController.createIssue,
);

export const issueRoutes = router;
