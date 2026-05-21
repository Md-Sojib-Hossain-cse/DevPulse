import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
const config = {
    port: process.env.PORT,
    db_connection_string: process.env.DB_CONNECTION_STRING,
};
export default config;
//# sourceMappingURL=index.js.map