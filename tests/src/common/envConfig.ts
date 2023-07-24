interface ITestData {
  BASE_URL: string;
}

export type Env = 'development' | 'bomLive';

const generateConfig = (urlOverride = 'http://www.bom.gov.au') => {
  const BASE_URL = process.env.URL || urlOverride;
  return { BASE_URL };
};

const testData: Record<Env, ITestData> = {
  development: generateConfig(),
  bomLive: generateConfig('http://www.bom.gov.au')
};

export const formTestData: ITestData = testData[process.env?.REACT_APP_STAGE ?? 'development'];
