export interface IEnvInterface {
  NODE_ENV: string;
  APP_URL: string;
  PORT: string;
  DB_DEV: string;
  USERNAME_DB_DEV: string;
  PASSWORD_DB_DEV: string;
  ENABLE_SWAGGER: boolean;
  SENTRY_URI: string;
  SENTRY_ENABLE: boolean;
  JWT_SECRET: string;
  BAYARIND_DEV_URL: string;
  PAYMENT_SERVICE_URL: string;
  HOST_PROD: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
}
