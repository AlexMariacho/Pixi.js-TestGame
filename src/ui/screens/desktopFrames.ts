import { buildFrameScene, createNodeSprite } from '../components/figmaCsvScene';

type FrameElement = {
  nodeId: string;
  assetNodeId?: string;
};

type ElementMap = Record<string, string | FrameElement>;

type ElementKey<T extends ElementMap> = keyof T;

class DesktopFrame<T extends ElementMap> {
  constructor(
    public readonly name: string,
    public readonly elements: T,
  ) {}

  buildScene(keys?: readonly ElementKey<T>[]) {
    const selectedElements: Array<string | FrameElement> = keys
      ? keys.map((key) => this.elements[key])
      : Object.values(this.elements);
    return buildFrameScene(this.name, {
      nodes: selectedElements.map((entry) => this.toFrameElement(entry)),
    });
  }

  createElementSprite(key: ElementKey<T>) {
    const element = this.toFrameElement(this.elements[key]);
    return createNodeSprite(element.nodeId, this.name, { assetNodeId: element.assetNodeId });
  }

  private toFrameElement(entry: string | FrameElement): FrameElement {
    if (typeof entry === 'string') {
      return { nodeId: entry };
    }

    return entry;
  }
}

const desktop1Elements = {
  background: '1:26',
  cardFrame: '1:58',
  badgeGroup: '1:75',
  leftArrowGroup: '1:15',
  rightArrowGroup: '1:14',
  selectButtonRect: '1:19',
} as const;

const desktop2Elements = {
  background: '1:30',
  unionShape: '1:64',
  badgeGroup: '1:76',
  leftArrowGroup: '1:37',
  rightArrowGroup: '1:34',
  selectButtonRect: '1:40',
} as const;

const desktop3Elements = {
  background: '1:44',
  cardFrame: '1:165',
  resultBadgeGroup: '1:87',
  decorationGroup: '1:101',
  closeButtonGroup: {
    nodeId: '25:2',
    assetNodeId: '23:12',
  },
} as const;

const desktop4Elements = {
  background: '1:116',
  unionShape: '1:170',
  decorationGroup: '1:121',
  resultBadgeGroup: '1:125',
  textViewportRect: '1:102',
  scrollbarGroup: '1:147',
  closeButtonGroup: '23:12',
} as const;

export const DESKTOP_1 = new DesktopFrame('Desktop - 1', desktop1Elements);
export const DESKTOP_2 = new DesktopFrame('Desktop - 2', desktop2Elements);
export const DESKTOP_3 = new DesktopFrame('Desktop - 3', desktop3Elements);
export const DESKTOP_4 = new DesktopFrame('Desktop - 4', desktop4Elements);
