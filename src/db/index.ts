import { Pool } from "pg";
import config from "../config";

const pool = new Pool({
  connectionString: config.db_connection_string,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL UNIQUE PRIMARY KEY,
      name VARCHAR(20) NOT NULL,
      email VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(10) NOT NULL DEFAULT 'contributor' 
        CHECK (role IN ('contributor', 'maintainer')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(
      id SERIAL UNIQUE PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL 
        CHECK(LENGTH(description) >=20),
      type VARCHAR(20) NOT NULL 
        CHECK(type IN('bug' , 'feature_request')),
      status VARCHAR(15) NOT NULL DEFAULT 'open' 
        CHECK (status IN('open', 'in_progress' , 'resolved')),
      reporter_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
  } catch (error) {
    throw new Error("Cannot connect to the database!");
  }
};

export default initDB;
