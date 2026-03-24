# Figma Sync Guide For Agents

## Target file
- Figma file key: `kWIy02Wro09TYXsrd21H4y`
- Main page node: `0:1`
- Design link: <https://www.figma.com/design/kWIy02Wro09TYXsrd21H4y/%D1%82%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D0%BE%D0%B5?node-id=0-1&p=f&t=SWEI9Fyf2N6ddqsK-0>

## Preferred flow
1. Use Figma MCP (`get_design_context` + `get_screenshot`) when OAuth token is valid.
2. Save/refresh coordinates in `src/assets/figma/coordinates.template.json`.
3. Update layout constants in UI screens/components.

## Current fallback (when MCP auth fails)
- Use Figma REST API with `X-Figma-Token` header to export node data.
- Write raw response to `src/assets/figma/page-0-1.raw.json`.
- Rebuild `coordinates.template.json` from `absoluteBoundingBox` fields.

## Do not do
- Do not hardcode new coordinates without syncing exported artifacts.
- Do not treat screenshot-only measurements as source of truth when node JSON is available.
