/* eslint-disable import/no-default-export */
import { devices, PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

export interface ITestOptions {
  newEmail: string;
}

dotenv.config();

const config: PlaywrightTestConfig<ITestOptions> = {
  timeout: 45000,
  use: {
    geolocation: { longitude: 151.206635, latitude: -33.8559037 },
    ignoreHTTPSErrors: true,
    locale: 'en-AU',
    permissions: ['geolocation'],
    launchOptions: {
      headless: false
    },
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  testDir: './src',
  outputDir: './test-results',
  reporter: [['html', { outputFolder: 'reports' }], ['list']],
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        newEmail: `theyounganakinskywalker+${Date.now()}@gmail.com`
      }
    }

    // {
    //   name: 'Desktop Firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     newEmail: `theyounganakinskywalker+${Date.now()}@gmail.com`
    //   }
    // }
  ]
};
export default config;
