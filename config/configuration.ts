
export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3001,
  postgres: {
    uri: process.env.POSTGRES_URI,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB,
    sync: process.env.POSTGRES_SYNCHRONIZE,
  },
});

