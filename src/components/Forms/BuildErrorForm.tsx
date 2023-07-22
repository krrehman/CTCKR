import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Content, FormWrapper, Header, IErrorFormProps } from './Form';
import { Heading2, Text } from '@cmctechnology/phoenix-stockbroking-web-design';
import { getErrorFormDetails } from './FormDetails';

export const BuildErrorForm: React.FC<IErrorFormProps> = ({ errorOutcome }) => {
  const { t } = useTranslation();

  const { title, subtitle, content } = useMemo(() => getErrorFormDetails({ errorOutcome, t }), [errorOutcome]);

  return (
    <FormWrapper>
      <Header>
        <Heading2>{title}</Heading2>
        {!!subtitle && <Text>{subtitle}</Text>}
      </Header>
      <Content>{content}</Content>
    </FormWrapper>
  );
};
