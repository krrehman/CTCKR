import { test, expect } from './fixtures/module';

const THRESHHOLD = 50

test('Test if it will rain in Sydney after 3 days: @regression', async ({ forecastPage, page }) => {
  
  await forecastPage.goToCityForecast();
  await expect(page).toHaveURL(forecastPage.forecastUrl);

  const forecast = await forecastPage.getThirdDayForecast()

  //Note: if the percentage rain number is greater than 50% just Assert FAIL the test
  expect(forecast, `Looks like it will rain on ${forecastPage.thirdDayFormatted}`).toBeLessThanOrEqual(THRESHHOLD)

});
