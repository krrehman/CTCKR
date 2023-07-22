import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IPodManifest } from '../../pods/podProps';
import { PodItem } from './PodItem';
import { usePodManifest } from './usePodManifest';

interface IPodClassNames {
  previousPodClassName: string;
  nextPodClassName: string;
}

const SHOW_POD = `show`;
const TRANSITION_INTERVAL = 1000;
const DELAY_INTERVAL = 100;

const PodContentWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  align-items: center;
`;

export const PodItemWrapper = styled.div`
  display: flex;
  justify-content: center;
  grid-area: 1 / 1 / 1 / 1;
  opacity: 0;
  transition: opacity ${TRANSITION_INTERVAL}ms linear;

  &.${SHOW_POD} {
    opacity: 1;
  }
`;

export const PodManager: React.FC = (): JSX.Element => {
  const { previousPodManifest, nextPodManifest } = usePodManifest();
  const name = nextPodManifest?.name;
  const [podManifestList, setPodManifestList] = useState<IPodManifest[]>([]);
  const [podClassName, setPodClassName] = useState<IPodClassNames>({ previousPodClassName: ``, nextPodClassName: `` });

  let timeoutId: number;

  const rerenderNextPod = useCallback(() => {
    setPodManifestList([nextPodManifest]);
  }, [nextPodManifest]);

  const showPodAfterDelay = () => {
    timeoutId = window.setTimeout(rerenderNextPod, TRANSITION_INTERVAL);
    setPodClassName({ previousPodClassName: ``, nextPodClassName: SHOW_POD });
  };

  useEffect(() => {
    if (!previousPodManifest && nextPodManifest) {
      setPodClassName({ previousPodClassName: ``, nextPodClassName: SHOW_POD });
      setPodManifestList([nextPodManifest]);
    } else if (previousPodManifest) {
      setPodClassName({ previousPodClassName: ``, nextPodClassName: `` });
      setPodManifestList([previousPodManifest, nextPodManifest]);
      timeoutId = window.setTimeout(showPodAfterDelay, DELAY_INTERVAL);
    }
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [name]);

  return (
    <PodContentWrapper>
      {podManifestList.map((manifest: IPodManifest): JSX.Element => {
        const { name: podName } = manifest;
        const { previousPodClassName, nextPodClassName } = podClassName;
        return (
          <PodItemWrapper className={podName === name ? nextPodClassName : previousPodClassName} id={podName} key={podName}>
            <PodItem name={podName} />
          </PodItemWrapper>
        );
      })}
    </PodContentWrapper>
  );
};
