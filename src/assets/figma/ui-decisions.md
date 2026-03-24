# Figma to Pixi UI decisions (node 0:1)

## Base canvas
- Base viewport: `1440x1024`
- Main screen frame: `Desktop - 1` (`id: 1:2`, `x=0`, `y=0`, `w=1440`, `h=1024`)

## Palette (from fills/strokes)
- Background dark: `#39373A` (`r=0.2235, g=0.2157, b=0.2275`)
- Card light: `#F4F5F0` (`r=0.9569, g=0.9608, b=0.9412`)
- Accent red: `#A62B30` (`r=0.6510, g=0.1686, b=0.1882`)

## Main card structure (Desktop - 1)
- Full background rectangle (`1:26`): `0,0,1440x1024`
- Card outline frame (`1:58`): `460,302,520x420`
- Card union shape (`1:63`): `470,205,500x507`

## Header and role block
- Title text `ДОБРЫЙ ВЕЧЕР` (`1:8`): `521,400,398x52`, font `Ruslan Display`, `48`
- Role text `я диспетчер` (`1:22`): `627,469,185x58`, font `Alumni Sans`, `48`
- Star mark group (`1:75`): `647,222,145.352x145.352`

## Controls
- Left circular button group (`1:15`): `521,570,50x50`
- Right circular button group (`1:14`): `869,570,50x50`
- Primary button rectangle (`1:19`): `595,560,250x70`
- Primary button label `ВЫБРАТЬ` (`1:20`): `638,582,164x35`, font `Ruslan Display`, `32`

## Mapping to Pixi layout constants
- Recommended screen constants:
  - `SCREEN_WIDTH = 1440`
  - `SCREEN_HEIGHT = 1024`
  - `CARD_FRAME_BOUNDS = { x: 460, y: 302, width: 520, height: 420 }`
  - `TITLE_BOUNDS = { x: 521, y: 400, width: 398, height: 52 }`
  - `ROLE_BOUNDS = { x: 627, y: 469, width: 185, height: 58 }`
  - `LEFT_ARROW_BOUNDS = { x: 521, y: 570, width: 50, height: 50 }`
  - `RIGHT_ARROW_BOUNDS = { x: 869, y: 570, width: 50, height: 50 }`
  - `SELECT_BUTTON_BOUNDS = { x: 595, y: 560, width: 250, height: 70 }`

## Saved artifacts
- Raw node payload: `src/assets/figma/page-0-1.raw.json`
- Coordinates template: `src/assets/figma/coordinates.template.json`
