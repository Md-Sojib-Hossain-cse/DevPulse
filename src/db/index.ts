import { Pool } from "pg";
import config from "../config";

const pool = new Pool({
  connectionString: config.db_connection_string,
});

const initDB = async () => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export default initDB;
