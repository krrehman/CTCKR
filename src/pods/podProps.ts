export interface IPodProps {
  id: string;
}

export interface IBgColor {
  bgColor: string;
  bgTextColor: string;
}

export type BgColorArray = {
  0: IBgColor;
} & IBgColor[];

export interface IPodDescriptor extends IPodProps {
  componentName: string;
  moduleConstructor: (id: string, config?: any) => JSX.Element;
  disclaimerConstructor?: (url: string, color: string) => JSX.Element;
  bgColors: BgColorArray;
  config?: any;
}

export interface IPodLayerSize {
  width: string;
  height?: string;
}

export interface IPodLayerPosition {
  left: string;
  top: string;
}

export interface IPodLayer extends IPodProps {
  position: IPodLayerPosition;
  size: IPodLayerSize;
}

export interface IPodManifest {
  name: string;
  enabled: boolean;
  config?: any;
}

export interface IUpdatedPodManifestList {
  nextPodManifest: IPodManifest;
  previousPodManifest?: IPodManifest;
}

export interface IPodIntervalCallback {
  (previousPodManifest: IPodManifest, nextPodDescriptor: IPodManifest): void;
}
