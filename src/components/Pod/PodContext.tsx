import { createContext } from 'react';
import { IPodDescriptor } from '../../pods/podProps';

const DEFAULT_BG_COLOR = `#FFFFFF`;
const DEFAULT_BG_TEXT_COLOR = `#FFFFFF`;

export const defaultBackgroundColors = {
  bgColor: DEFAULT_BG_COLOR,
  bgTextColor: DEFAULT_BG_TEXT_COLOR
};

export const initialPodContext = {
  podDescriptor: {
    id: ``,
    componentName: ``,
    bgColors: [defaultBackgroundColors],
    // eslint-disable-next-line i18next/no-literal-string
    moduleConstructor: () => <>no module!</>,
    // eslint-disable-next-line i18next/no-literal-string
    disclaimerConstructor: () => <>no disclaimer!</>
  } as IPodDescriptor,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPodDescriptor: (value: IPodDescriptor): void => {}
};

export const PodContext = createContext(initialPodContext);
