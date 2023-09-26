export default () => ({
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  appEnv: process.env.NODE_ENV,
  appTimeout: parseInt(process.env.APP_TIMEOUT, 10) || 30000,
  appUrl: process.env.APP_URL,
  aws: {
    region: process.env.AWS_REGION,
    s3BucketName: process.env.AWS_BUCKET_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessKeySecret: process.env.AWS_SECRET_ACCESS_KEY,
  },
  database: {
    type: process.env.DATABASE_DRIVER as 'postgres' | 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    db: process.env.DATABASE,
    dbTest: process.env.DATABASE_TEST,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: +process.env.MAIL_PORT,
    from: process.env.MAIL_FROM,
    user: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
});
