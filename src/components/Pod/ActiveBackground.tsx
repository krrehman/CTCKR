import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { EFFECT_INTERVAL } from '../../pods/pod';
import { IBgColor } from '../../pods/podProps';
import { defaultBackgroundColors, PodContext } from './PodContext';

const BackgroundWrapper = styled.div<Partial<IBgColor>>`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: ${(props: Partial<IBgColor>) => props.bgColor};
  transition: background-color 1s linear;
`;

export const ActiveBackground: React.FC<{}> = (): JSX.Element => {
  const { podDescriptor } = useContext(PodContext);
  const { bgColors } = podDescriptor;

  const timeoutInterval = bgColors.length > 0 ? EFFECT_INTERVAL / bgColors.length : EFFECT_INTERVAL;
  const initialBgColor = bgColors.length > 0 ? bgColors[0].bgColor : defaultBackgroundColors.bgColor;

  const timerRef = useRef(0);
  const [bgColor, setBgColor] = useState(initialBgColor);

  const clearTimer = () => {
    if (!!timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
  };

  const switchBgColor = (index: number) => {
    clearTimer();
    setBgColor(bgColors[index].bgColor);

    let increment = index;
    increment += 1;
    const itemIndex = increment < bgColors.length ? increment : 0;
    timerRef.current = window.setTimeout(switchBgColor, timeoutInterval, itemIndex);
  };

  useEffect(() => {
    clearTimer();
    setBgColor(initialBgColor);
    if (bgColors.length > 1) {
      timerRef.current = window.setTimeout(switchBgColor, timeoutInterval, 1);
    }
    return () => clearTimer();
  }, [bgColors]);

  return <BackgroundWrapper bgColor={bgColor} />;
};
