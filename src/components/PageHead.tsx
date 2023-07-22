import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { pageConstants } from '../constants/pageConstants';
import { IPage } from '../models/page';

export interface IPageHeadProps {
  page: IPage;
}

export const PageHead: React.FC<IPageHeadProps> = ({ page }) => {
  const { t } = useTranslation();
  const contentName = t(`Join over 1 million investors on an award winning platform and access $0 brokerage on US, UK, Canadian and Japanese markets.`);
  return (
    <Helmet>
      <title>{page.title ?? pageConstants.defaultTitle(t)}</title>
      <meta name='title' content={page.title ?? pageConstants.defaultTitle(t)} />
      <meta property='og:title' content={page.title ?? pageConstants.defaultTitle(t)} />
      <meta name='description' content={contentName} />
      <meta property='og:description' content={contentName} />
      <meta property='twitter:description' content={contentName} />
    </Helmet>
  );
};
