import { Sequelize } from 'sequelize';
import EnvConfig from './env.config';

const sequelize = new Sequelize(
  EnvConfig.DB_DEV,
  EnvConfig.USERNAME_DB_DEV,
  EnvConfig.PASSWORD_DB_DEV,
  {
    host: EnvConfig.HOST_PROD,
    dialect: 'mariadb',
    logging: false,
    dialectOptions: {
      connectTimeout: 60000 // 60 seconds
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+07:00'
  }
);

export default sequelize;
