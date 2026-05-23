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

router.get("/", issuesController.getAllIssues);

router.get("/:id", issuesController.getSingleIssue);

router.patch(
  "/:id",
  auth(USER_ROLES.contributor, USER_ROLES.maintainer),
  issuesController.updateIssues,
);

router.delete(
  "/:id",
  auth(USER_ROLES.maintainer),
  issuesController.deleteIssue,
);

export const issueRoutes = router;
