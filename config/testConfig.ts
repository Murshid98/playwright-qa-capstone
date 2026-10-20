import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface TestConfig {
  baseURL: string;
  testUserEmail: string;
  testUserPassword: string;
  env: string;
}

const config: TestConfig = {
  baseURL: process.env.BASE_URL || 'https://automationexercise.com',
  testUserEmail: process.env.TEST_USER_EMAIL || '',
  testUserPassword: process.env.TEST_USER_PASSWORD || '',
  env: process.env.ENV || 'dev',
};

export default config;
