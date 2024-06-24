export default () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!) ?? 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  mongodbUri: process.env.MONGODB_URI,
});
