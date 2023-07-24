import { Page } from '@playwright/test';
import { formTestData } from '../common/envConfig';
import { locatorByHRole } from '../common/helpers';
import { getDaysFromNow } from '../common/dateHelper';

type City = 'Sydney' | 'Melbourne';
type State = 'NSW' | 'VIC';

export const forecast = (page: Page) => {
  const { BASE_URL } = formTestData;

  const getForecastUrl = (city: City, state: State) => `${BASE_URL}/${state.toLowerCase()}/forecasts/${city.toLowerCase()}.shtml`;

  return {
    page,
    BASE_URL,
    getForecastUrl,

    goToCityForecast: async (city: City) => {
      await page.goto(BASE_URL);
      let cityLink = locatorByHRole(page, `${city}`);
      await cityLink.click();
    },

    getDayForecast: async (days: number) => {
      const forecastName = await page
        .locator('div.day', { has: page.locator(`text=${getDaysFromNow(days)}`) })
        .locator('dd.rain > em.pop')
        .textContent();
      return Number.parseFloat(forecastName!);
    }
  };
};
