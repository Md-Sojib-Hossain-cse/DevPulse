import { pool } from "../../db";
import type { TIssue, TIssueQuery } from "./issues.interface";

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

const getAllIssuesFromDB = async (query: TIssueQuery) => {
  const sort = query.sort || "newest";

  const issuesData = await pool.query(`
  SELECT * FROM issues
  ${
    query?.type && query?.status
      ? `WHERE type='${query.type}' AND status='${query.status}'`
      : query?.type
        ? `WHERE type='${query.type}'`
        : query?.status
          ? `WHERE status='${query.status}'`
          : ""
  }
  ORDER BY issues.created_at ${sort === "newest" ? "DESC" : "ASC"}
`);

  const usersData = await pool.query(`
  SELECT id , name , role FROM users
  `);

  const hashTableOfUserData = usersData?.rows?.reduce((table, currentUser) => {
    if (!table?.currentUser?.id) {
      table[currentUser.id] = currentUser;
    }
    return table;
  }, {});

  const result = issuesData.rows.map((issue) => {
    issue.reporter = hashTableOfUserData[issue.reporter_id];
    delete issue.reporter_id;
    return issue;
  });

  return result;
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
};
