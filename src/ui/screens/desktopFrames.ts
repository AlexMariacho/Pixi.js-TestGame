import { buildFrameScene, createNodeSprite } from '../components/figmaCsvScene';

type FrameElement = {
  nodeId: string;
  assetNodeId?: string;
  positionOffset?: {
    x: number;
    y: number;
  };
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
    const scene = buildFrameScene(this.name, {
      nodes: selectedElements.map((entry) => this.toFrameElement(entry)),
    });
    for (const entry of selectedElements) {
      const element = this.toFrameElement(entry);
      this.applyPositionOffset(scene.nodes.get(element.nodeId), element.positionOffset);
    }
    return scene;
  }

  createElementSprite(key: ElementKey<T>) {
    const element = this.toFrameElement(this.elements[key]);
    const nodeSprite = createNodeSprite(element.nodeId, this.name, { assetNodeId: element.assetNodeId });
    this.applyPositionOffset(nodeSprite, element.positionOffset);
    return nodeSprite;
  }

  private toFrameElement(entry: string | FrameElement): FrameElement {
    if (typeof entry === 'string') {
      return { nodeId: entry };
    }

    return entry;
  }

  private applyPositionOffset(
    nodeSprite: ReturnType<typeof createNodeSprite> | undefined,
    positionOffset?: FrameElement['positionOffset'],
  ): void {
    if (!nodeSprite || !positionOffset) {
      return;
    }

    nodeSprite.sprite.position.set(
      nodeSprite.sprite.position.x - positionOffset.x,
      nodeSprite.sprite.position.y - positionOffset.y,
    );
    nodeSprite.bounds.x -= positionOffset.x;
    nodeSprite.bounds.y -= positionOffset.y;
  }
}

const DISPATCHER_RESULT_WINDOW_OFFSET = { x: 9, y: 3 } as const;
const DISPATCHER_RESULT_LOGO_OFFSET = { x: 10, y: -3 } as const;
const DISPATCHER_RESULT_STARS_OFFSET = { x: 10, y: 3 } as const;
const MEANING_RESULT_WINDOW_OFFSET = { x: 9, y: -7 } as const;
const MEANING_RESULT_LOGO_OFFSET = { x: 10, y: -3 } as const;
const MEANING_RESULT_STARS_OFFSET = { x: 10, y: 3 } as const;

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
  cardFrame: {
    nodeId: '1:165',
    positionOffset: DISPATCHER_RESULT_WINDOW_OFFSET,
  },
  resultBadgeGroup: {
    nodeId: '1:87',
    positionOffset: DISPATCHER_RESULT_LOGO_OFFSET,
  },
  decorationGroup: {
    nodeId: '1:101',
    positionOffset: DISPATCHER_RESULT_STARS_OFFSET,
  },
  closeButtonGroup: {
    nodeId: '25:2',
    assetNodeId: '23:12',
    positionOffset: DISPATCHER_RESULT_WINDOW_OFFSET,
  },
} as const;

const desktop4Elements = {
  background: '1:116',
  unionShape: {
    nodeId: '1:170',
    positionOffset: MEANING_RESULT_WINDOW_OFFSET,
  },
  resultBadgeGroup: {
    nodeId: '1:125',
    positionOffset: MEANING_RESULT_LOGO_OFFSET,
  },
  textViewportRect: {
    nodeId: '1:102',
    positionOffset: MEANING_RESULT_WINDOW_OFFSET,
  },
  scrollbarGroup: {
    nodeId: '1:147',
    positionOffset: MEANING_RESULT_WINDOW_OFFSET,
  },
  decorationGroup: {
    nodeId: '1:121',
    positionOffset: MEANING_RESULT_STARS_OFFSET,
  },
  closeButtonGroup: {
    nodeId: '23:12',
    positionOffset: MEANING_RESULT_WINDOW_OFFSET,
  },
} as const;

export const DESKTOP_1 = new DesktopFrame('Desktop - 1', desktop1Elements);
export const DESKTOP_2 = new DesktopFrame('Desktop - 2', desktop2Elements);
export const DESKTOP_3 = new DesktopFrame('Desktop - 3', desktop3Elements);
export const DESKTOP_4 = new DesktopFrame('Desktop - 4', desktop4Elements);
