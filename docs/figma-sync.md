# Figma Sync Guide For Agents

## Target file

- Figma file key: `kWIy02Wro09TYXsrd21H4y`
- Main page node: `0:1`
- Design link: <https://www.figma.com/design/kWIy02Wro09TYXsrd21H4y/%D1%82%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D0%BE%D0%B5?node-id=0-1&p=f&t=SWEI9Fyf2N6ddqsK-0>

## Current runtime dependency on Figma artifacts

The app does not draw the full UI procedurally anymore. It depends on four artifact groups staying in sync:

1. `src/assets/figma/coordinates.template.json`
2. `src/assets/figma/page-0-1.raw.json`
3. `src/assets/textures/figma/desktop-elements-svg/*.svg`
4. CSV manifests inside `src/assets/textures/figma/desktop-elements-svg/` (runtime uses `elements-index.csv` and `duplicates-map.csv`)

`figmaCsvScene.ts` reads these artifacts together to reconstruct desktop frame scenes at runtime.

## Preferred flow

1. Use Figma MCP (`get_design_context` plus screenshots/assets as needed) when auth is valid.
2. Refresh `src/assets/figma/page-0-1.raw.json` from the current page node.
3. Refresh `src/assets/figma/coordinates.template.json` from exported Figma node geometry.
4. Re-export changed SVG assets into `src/assets/textures/figma/desktop-elements-svg/`.
5. Refresh export manifests so node IDs still match assets. At minimum keep `elements-index.csv` and `duplicates-map.csv` in sync with exported SVG files; update JSON manifests only if your export tooling requires them.
6. Update `src/assets/figma/ui-decisions.md` if mapping assumptions changed.
7. Only after artifacts are current, adjust screen/layout constants in `src/ui/screens/*` or `src/ui/components/*`.

## Current fallback (when MCP auth fails)

- Use Figma REST API with `X-Figma-Token` header to fetch node JSON.
- Save the raw response to `src/assets/figma/page-0-1.raw.json`.
- Rebuild `coordinates.template.json` from node geometry.
- Export the required SVG assets and regenerate the manifests used by the runtime.

## How runtime uses the artifacts

- `coordinates.template.json` supplies frame and node positions.
- `page-0-1.raw.json` supplies `absoluteRenderBounds` used for more accurate sprite bounds.
- `elements-index.csv` maps node IDs to exported asset files.
- `duplicates-map.csv` resolves duplicate node exports back to canonical assets.
- `desktopFrames.ts` chooses which exported nodes belong to Desktop 1 through Desktop 4.

## Do not do

- Do not hardcode new coordinates without syncing exported artifacts first.
- Do not change only the SVGs while leaving old manifests in place.
- Do not treat screenshot-only measurements as source of truth when node JSON is available.
- Do not spread asset-specific offset fixes across multiple screens if a shared frame/layout helper can own them.
