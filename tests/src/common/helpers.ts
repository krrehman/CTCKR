import { Page } from '@playwright/test';

export const locatorByHRole = (page: Page, attribute: string) => page.getByRole('heading', { name: `${attribute}` });

export const exitOnError = (page: Page, skipLocations?: string[]) => {
  page.on('console', (message) => {
    const skip = skipLocations?.find((loc) => message.location()?.url.endsWith(loc));
    if (!skip && (message.type() === 'error' || message.type() === 'warn')) {
      throw new Error(message.text());
    }
  });
};

