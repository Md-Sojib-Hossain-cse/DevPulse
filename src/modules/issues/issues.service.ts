import { pool } from "../../db";
import type { TIssue } from "./issues.interface";

const createIssueIntoDB = async (
  payload: Pick<TIssue, "title" | "description" | "type" | "reporter_id">,
) => {
  const { title, description, type, reporter_id } = payload;
  const result = await pool.query(
    `
    INSERT INTO issues (title,description,type,reporter_id)
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,
    [title, description, type, reporter_id],
  );

  return result;
};

export const issuesService = {
  createIssueIntoDB,
};
