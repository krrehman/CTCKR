import { Page } from '@playwright/test';
import { formTestData } from '../common/envConfig';
import { locatorByHRole } from '../common/helpers';
import { formatDateMessage, getDaysFromNow } from '../common/dateHelper'

export const forecast = (page: Page) => {
  const { BASE_URL } = formTestData;

  const cityLink = locatorByHRole(page, 'Sydney' );
  const forecastUrl = `${BASE_URL}/nsw/forecasts/sydney.shtml`;
  const thirdDay = getDaysFromNow(3);
  const thirdDayFormatted = formatDateMessage(thirdDay);

  return {
    page,
    BASE_URL,
    forecastUrl,
    thirdDayFormatted,

    goToCityForecast: async () => {
      await page.goto(BASE_URL);
      await cityLink.click();
    },

    getThirdDayForecast: async () => {
      const forecast = await page
      .locator('div.day', { has: page.locator(`text=${thirdDay}`) })
      .locator('dd.rain > em.pop')
      .innerText()

      return parseFloat(forecast)
    }
  };
};
