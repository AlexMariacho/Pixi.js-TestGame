import { Assets, Container, Sprite, Texture } from 'pixi.js';
import coordinatesTemplate from '../../assets/figma/coordinates.template.json';
import rawFigmaPayload from '../../assets/figma/page-0-1.raw.json';
import elementsIndexCsv from '../../assets/textures/figma/desktop-elements-svg/elements-index.csv?raw';
import duplicatesMapCsv from '../../assets/textures/figma/desktop-elements-svg/duplicates-map.csv?raw';

type CsvRow = {
  [key: string]: string;
};

type AssetRow = {
  frame: string;
  nodeId: string;
  file: string;
};

type CoordinateNode = {
  nodeId: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  children?: CoordinateNode[];
};

type CoordinatePayload = {
  frames: CoordinateNode[];
};

type BuildFrameSceneOptions = {
  nodeIds?: string[];
};

type NodeSprite = {
  sprite: Sprite;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

type FrameScene = {
  container: Container;
  nodes: Map<string, NodeSprite>;
};

type RenderBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type RawNode = {
  id?: string;
  children?: RawNode[];
  absoluteBoundingBox?: RenderBounds | null;
  absoluteRenderBounds?: RenderBounds | null;
};

const DESKTOP_SVG_MARKER = '/desktop-elements-svg/';
const SVG_MODULES = import.meta.glob('../../assets/textures/figma/desktop-elements-svg/**/*.svg', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const svgUrlByRelativePath = new Map<string, string>();
for (const [modulePath, moduleUrl] of Object.entries(SVG_MODULES)) {
  const normalized = modulePath.replace(/\\/g, '/');
  const markerIndex = normalized.indexOf(DESKTOP_SVG_MARKER);
  if (markerIndex < 0) {
    continue;
  }

  const relativePath = normalized.slice(markerIndex + DESKTOP_SVG_MARKER.length);
  svgUrlByRelativePath.set(relativePath, moduleUrl);
}

const coordinates = coordinatesTemplate as CoordinatePayload;
const frameByName = new Map<string, CoordinateNode>();
const coordinateByNodeId = new Map<string, CoordinateNode>();

for (const frame of coordinates.frames) {
  frameByName.set(normalizeFrameName(frame.name), frame);
  collectCoordinates(frame);
}

const assetRows = parseElementsRows(elementsIndexCsv);
const assetByNodeId = new Map<string, AssetRow>();
for (const row of assetRows) {
  assetByNodeId.set(row.nodeId, row);
}

const duplicateAliases = parseDuplicateAliases(duplicatesMapCsv);
const renderMetaByNodeId = extractRenderMeta(rawFigmaPayload as unknown as RawNode);
let svgAssetsPreloaded = false;

export async function preloadFigmaCsvSvgAssets(): Promise<void> {
  if (svgAssetsPreloaded) {
    return;
  }

  const urls = Array.from(new Set(svgUrlByRelativePath.values()));
  if (urls.length > 0) {
    await Assets.load(urls);
  }

  svgAssetsPreloaded = true;
}

export function buildFrameScene(frameName: string, options?: BuildFrameSceneOptions): FrameScene {
  const normalizedFrameName = normalizeFrameName(frameName);
  const frame = frameByName.get(normalizedFrameName);
  if (!frame) {
    console.warn(`[figmaCsvScene] Frame not found: ${frameName}`);
    return { container: new Container(), nodes: new Map<string, NodeSprite>() };
  }

  const nodeIds =
    options?.nodeIds ??
    (frame.children ?? [])
      .filter((child) => child.type !== 'TEXT')
      .map((child) => child.nodeId);

  const container = new Container();
  const nodes = new Map<string, NodeSprite>();

  for (const nodeId of nodeIds) {
    const nodeSprite = createNodeSprite(nodeId, normalizedFrameName);
    if (!nodeSprite) {
      continue;
    }

    nodes.set(nodeId, nodeSprite);
    container.addChild(nodeSprite.sprite);
  }

  return { container, nodes };
}

export function createNodeSprite(nodeId: string, frameName: string): NodeSprite | null {
  const normalizedFrameName = normalizeFrameName(frameName);
  const frame = frameByName.get(normalizedFrameName);
  if (!frame) {
    console.warn(`[figmaCsvScene] Frame not found while creating node sprite: ${frameName}`);
    return null;
  }

  const node = coordinateByNodeId.get(nodeId);
  if (!node) {
    return null;
  }

  const asset = resolveAssetRow(nodeId);
  if (!asset) {
    return null;
  }

  const relativePath = toRelativeDesktopPath(asset.file);
  const assetUrl = svgUrlByRelativePath.get(relativePath);
  if (!assetUrl) {
    return null;
  }

  const texture = (Assets.get(assetUrl) as Texture | undefined) ?? Texture.from(assetUrl);
  const sprite = new Sprite(texture);

  const renderMeta = renderMetaByNodeId.get(nodeId);
  const offsetX = renderMeta ? renderMeta.x - node.x : 0;
  const offsetY = renderMeta ? renderMeta.y - node.y : 0;

  const localX = node.x - frame.x + offsetX;
  const localY = node.y - frame.y + offsetY;

  sprite.position.set(localX, localY);

  return {
    sprite,
    bounds: {
      x: localX,
      y: localY,
      width: renderMeta?.width ?? node.width,
      height: renderMeta?.height ?? node.height,
    },
  };
}

function collectCoordinates(node: CoordinateNode): void {
  coordinateByNodeId.set(node.nodeId, node);
  if (!node.children) {
    return;
  }

  for (const child of node.children) {
    collectCoordinates(child);
  }
}

function parseElementsRows(csvText: string): AssetRow[] {
  const rows = parseCsv(csvText);
  const result: AssetRow[] = [];
  for (const row of rows) {
    const frame = row.frame;
    const nodeId = row.node_id;
    const file = row.file;
    if (!frame || !nodeId || !file) {
      continue;
    }

    result.push({ frame, nodeId, file });
  }

  return result;
}

function parseDuplicateAliases(csvText: string): Map<string, string> {
  const rows = parseCsv(csvText);
  const aliases = new Map<string, string>();
  for (const row of rows) {
    const duplicatePath = row.duplicate;
    const canonicalPath = row.canonical;
    if (!duplicatePath || !canonicalPath) {
      continue;
    }

    const duplicateNodeId = parseNodeIdFromExportPath(duplicatePath);
    const canonicalNodeId = parseNodeIdFromExportPath(canonicalPath);
    if (!duplicateNodeId || !canonicalNodeId) {
      continue;
    }

    aliases.set(duplicateNodeId, canonicalNodeId);
  }

  return aliases;
}

function resolveAssetRow(nodeId: string): AssetRow | undefined {
  const direct = assetByNodeId.get(nodeId);
  if (direct) {
    return direct;
  }

  const canonicalId = duplicateAliases.get(nodeId);
  if (!canonicalId) {
    return undefined;
  }

  return assetByNodeId.get(canonicalId);
}

function extractRenderMeta(rawPayload: RawNode): Map<string, RenderBounds> {
  const result = new Map<string, RenderBounds>();

  const traverse = (node: RawNode | undefined): void => {
    if (!node) {
      return;
    }

    const nodeId = node.id;
    const render = node.absoluteRenderBounds ?? undefined;
    if (nodeId && render) {
      result.set(nodeId, render);
    }

    const children = node.children ?? [];
    for (const child of children) {
      traverse(child);
    }
  };

  const rootNodes = (rawPayload as unknown as { nodes?: Record<string, { document?: RawNode }> }).nodes ?? {};
  for (const root of Object.values(rootNodes)) {
    traverse(root.document);
  }

  return result;
}

function normalizeFrameName(name: string): string {
  return name.replace(/\s*-\s*/g, '-').trim();
}

function toRelativeDesktopPath(absoluteOrRelativePath: string): string {
  const normalized = absoluteOrRelativePath.replace(/\\/g, '/');
  const markerIndex = normalized.indexOf(DESKTOP_SVG_MARKER);
  if (markerIndex >= 0) {
    return normalized.slice(markerIndex + DESKTOP_SVG_MARKER.length);
  }

  return normalized;
}

function parseNodeIdFromExportPath(exportPath: string): string | null {
  const normalized = exportPath.replace(/\\/g, '/');
  const match = normalized.match(/__(\d+-\d+)\.svg$/);
  if (!match) {
    return null;
  }

  return match[1].replace('-', ':');
}

function parseCsv(csvText: string): CsvRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);
  const rows: CsvRow[] = [];

  for (let index = 1; index < lines.length; index += 1) {
    const values = splitCsvLine(lines[index]);
    const row: CsvRow = {};
    for (let column = 0; column < headers.length; column += 1) {
      row[headers[column]] = values[column] ?? '';
    }
    rows.push(row);
  }

  return rows;
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let buffer = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        buffer += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(buffer);
      buffer = '';
      continue;
    }

    buffer += char;
  }

  values.push(buffer);
  return values;
}
