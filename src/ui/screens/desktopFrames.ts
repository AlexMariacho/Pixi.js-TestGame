import { buildFrameScene, createNodeSprite } from '../components/figmaCsvScene';

type ElementMap = Record<string, string>;

type ElementKey<T extends ElementMap> = keyof T;

class DesktopFrame<T extends ElementMap> {
  constructor(
    public readonly name: string,
    public readonly elements: T,
  ) {}

  buildScene(keys?: readonly ElementKey<T>[]) {
    const nodeIds = keys ? keys.map((key) => this.elements[key]) : Object.values(this.elements);
    return buildFrameScene(this.name, { nodeIds });
  }

  createElementSprite(key: ElementKey<T>) {
    return createNodeSprite(this.elements[key], this.name);
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
