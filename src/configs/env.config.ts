import dotenv from 'dotenv';
import { IEnvInterface } from '../interfaces/env.interface';

dotenv.config();

const ENV: any = process.env;
const EnvConfig: IEnvInterface = ENV;

// if (EnvConfig.NODE_ENV !== 'production') {
//   EnvConfig.SENTRY_ENABLE = false;
//   EnvConfig.ENABLE_CLUSTER = false;
//   EnvConfig.APP_CORES = 1;
// }

if (EnvConfig.NODE_ENV === 'development') {
  EnvConfig.APP_URL = EnvConfig.APP_URL;
  EnvConfig.DB_DEV = EnvConfig.DB_DEV;
  EnvConfig.ENABLE_SWAGGER = EnvConfig.ENABLE_SWAGGER;
  EnvConfig.PORT = EnvConfig.PORT;
  EnvConfig.USERNAME_DB_DEV = EnvConfig.USERNAME_DB_DEV;
  EnvConfig.PASSWORD_DB_DEV = EnvConfig.PASSWORD_DB_DEV;
  EnvConfig.SENTRY_URI = EnvConfig.SENTRY_URI;
  EnvConfig.SENTRY_ENABLE = EnvConfig.SENTRY_ENABLE;
  EnvConfig.JWT_SECRET = EnvConfig.JWT_SECRET;
  EnvConfig.BAYARIND_DEV_URL = EnvConfig.JWT_SECRET;
  EnvConfig.PAYMENT_SERVICE_URL = EnvConfig.PAYMENT_SERVICE_URL;
  EnvConfig.HOST_PROD = EnvConfig.HOST_PROD;
  EnvConfig.EMAIL_USER = EnvConfig.EMAIL_USER;
  EnvConfig.EMAIL_PASS = EnvConfig.EMAIL_PASS;
  EnvConfig.SMTP_HOST = EnvConfig.SMTP_HOST;
  EnvConfig.SMTP_PORT = EnvConfig.SMTP_PORT;
}

export default EnvConfig;
