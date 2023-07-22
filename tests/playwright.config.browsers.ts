/* eslint-disable import/no-default-export */
import { devices } from '@playwright/test';
import config from './playwright.config';

/**
 * Record a basic flow in multiple screens and browsers
 */
config.use!.screenshot = 'on';
config.use!.trace = 'on-first-retry';
config.use!.video = 'on';
config.use!.launchOptions = {
  headless: false
};

config.projects = [
  {
    name: 'Pixel 5',
    use: {
      ...devices['Pixel 5']
    }
  },
  {
    name: 'Pixel 5 landscape',
    use: {
      ...devices['Pixel 5 landscape']
    }
  },
  {
    name: 'iPhone 11',
    use: {
      ...devices['iPhone 11']
    }
  },
  {
    name: 'iPhone 11',
    use: {
      ...devices['iPhone 11']
    }
  },
  {
    name: 'iPad Pro 11 landscape',
    use: {
      ...devices['iPad Pro 11 landscape']
    }
  },
  {
    name: 'Desktop Chrome',
    use: {
      ...devices['Desktop Chrome']
    }
  },
  {
    name: 'Desktop Firefox',
    use: {
      ...devices['Desktop Firefox']
    }
  },
  {
    name: 'Desktop Edge',
    use: {
      ...devices['Desktop Edge']
    }
  },
  {
    name: 'Desktop Safari',
    use: {
      ...devices['Desktop Safari']
    }
  },
  {
    name: 'Desktop Firefox HiDPI',
    use: {
      ...devices['Desktop Firefox HiDPI']
    }
  },
  {
    name: 'Desktop Chrome HiDPI',
    use: {
      ...devices['Desktop Chrome HiDPI']
    }
  },
  {
    name: 'Galaxy Tab S4',
    use: {
      ...devices['Galaxy Tab S4']
    }
  }
];

export { default } from './playwright.config';
