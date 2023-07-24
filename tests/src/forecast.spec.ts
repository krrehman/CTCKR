import { getDaysFromNow } from './common/dateHelper';
import { test, expect } from './fixtures/module';

const THRESHHOLD = 50;
const CITY = 'Sydney';
const STATE = 'NSW';
const DAY_FROM_NOW = 3;

test('Test if it will rain in Sydney after 3 days: @regression', async ({ forecastPage, page }) => {
  await forecastPage.goToCityForecast(CITY, STATE);
  await expect(page).toHaveURL(forecastPage.getForecastUrl(CITY, STATE));

  const forecast = await forecastPage.getDayForecast(DAY_FROM_NOW);

  //Note: if the percentage rain number is greater than 50% just Assert FAIL the test
  expect(forecast, `Looks like it will rain on ${getDaysFromNow(DAY_FROM_NOW)}`).toBeLessThanOrEqual(THRESHHOLD);
});
