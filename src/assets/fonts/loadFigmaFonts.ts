import alumniSansUrl from './figma/AlumniSans-Regular.ttf';
import anekUrl from './figma/AnekDevanagari-Regular.ttf';
import ruslanUrl from './figma/RuslanDisplay-Regular.ttf';
import { FIGMA_FONTS } from '../../ui/components/designTokens';

type FontResource = {
  family: string;
  sourceUrl: string;
};

const FONT_RESOURCES: FontResource[] = [
  { family: FIGMA_FONTS.heading, sourceUrl: ruslanUrl },
  { family: FIGMA_FONTS.body, sourceUrl: alumniSansUrl },
  { family: FIGMA_FONTS.compact, sourceUrl: anekUrl },
];

async function loadSingleFont(resource: FontResource): Promise<void> {
  const face = new FontFace(resource.family, `url(${resource.sourceUrl})`);
  await face.load();
  document.fonts.add(face);
}

export async function loadFigmaFonts(): Promise<void> {
  await Promise.all(FONT_RESOURCES.map(loadSingleFont));
}
