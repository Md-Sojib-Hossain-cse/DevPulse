import { pool } from "../../db";
import type { TJwtPayload } from "../../types";
import AppError from "../../utility/appError";
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

const getSingleIssueFromDB = async (id: string) => {
  const issueData = await pool.query(
    `
    SELECT * FROM issues
    WHERE id=$1
    `,
    [id],
  );

  if (!issueData.rows.length) {
    return null;
  }

  const userData = await pool.query(
    `
  SELECT id , name , role FROM users
  WHERE id=$1
  `,
    [issueData.rows[0].reporter_id],
  );

  const result = {
    ...issueData.rows[0],
    reporter: userData.rows[0],
  };

  delete result.reporter_id;

  return result;
};

const updateIssuesOnDB = async (
  id: string,
  payload: Partial<TIssue>,
  userInfo: TJwtPayload,
) => {
  const { title, description, type, status } = payload;

  if (userInfo.role === "maintainer") {
    const result = await pool.query(
      `
      UPDATE issues
      SET title=COALESCE($1,issues.title),description=COALESCE($2,issues.description),type=COALESCE($3,issues.type),status=COALESCE($4,issues.status),updated_at = NOW()
      WHERE id=$5
      RETURNING *
      `,
      [title, description, type, status, id],
    );
    return result.rows[0];
  } else if (userInfo.role === "contributor") {
    const result = await pool.query(
      `
      UPDATE issues
      SET title=COALESCE($1,issues.title),description=COALESCE($2,issues.description),type=COALESCE($3,issues.type),updated_at = NOW()
      WHERE id=$4 AND status=$5 AND reporter_id=$6
      RETURNING *
      `,
      [title, description, type, id, "open", userInfo.id],
    );
    if (!result.rows[0]) {
      throw new AppError(403, "You can only update your own open issues!");
    }
    return result.rows[0];
  } else {
    throw new AppError(403, "You can only update your own open issues");
  }
};
const deleteIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id=$1
    `,
    [id],
  );

  return result.rowCount;
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssuesOnDB,
  deleteIssueFromDB,
};
