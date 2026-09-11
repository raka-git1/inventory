declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    DIRECT_URL?: string;
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;
    SESSION_SECRET: string;
  }
}
