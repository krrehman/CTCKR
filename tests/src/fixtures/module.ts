import { test as base } from '@playwright/test';
import { ITestOptions } from '../../playwright.config';
import { forecast } from '../models/forecast.page';
import { exitOnError } from '../common/helpers';

interface IModuleFixtures extends ITestOptions {
  timeout: number;
  exitOnError: ReturnType<typeof exitOnError>;
  forecastPage: ReturnType<typeof forecast>;
}

export const test = base.extend<IModuleFixtures>({
  timeout: 45000,
  exitOnError: [
    async ({ page }, use) => {
      exitOnError(page, []);
      await use();
    },
    { auto: false }
  ],

  forecastPage: async ({ page }, use) => {
    const forecastPage = forecast(page);
    await use(forecastPage);
  }
});

export const describe = test.describe;
export const expect = test.expect;
