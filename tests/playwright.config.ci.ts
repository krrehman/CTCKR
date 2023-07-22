/* eslint-disable import/no-default-export */
import config from './playwright.config';
import * as dotenv from 'dotenv';

dotenv.config();

const retainOnFailure = `retain-on-failure`;

config.use!.video = retainOnFailure;
config.use!.trace = retainOnFailure;
config.use!.screenshot = 'only-on-failure';

config.use!.launchOptions = {
  headless: true
};

export { default } from './playwright.config';
