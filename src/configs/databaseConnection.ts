import { Sequelize } from "sequelize";
import EnvConfig from "./env.config";

const sequelize = new Sequelize(EnvConfig.DB_DEV, EnvConfig.USERNAME_DB_DEV, EnvConfig.PASSWORD_DB_DEV, {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false,
 });
 
 export default sequelize;