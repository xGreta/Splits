# H5 Spacing Guidelines

This file defines the spacing rules for the Splits mobile-first H5 page.
All future feature work should follow these rules unless there is a clear product reason to break them.

## Core spacing scale

Use this spacing scale consistently:

- `8px`: micro gap inside compact controls
- `12px`: small gap between related inline items
- `18px`: standard inner padding and text block gap
- `24px`: section-level breathing room between related blocks
- `28px`: emphasized separation between major blocks inside one card

Do not introduce arbitrary values unless a visual exception is intentionally required.

## Page shell

- Outer page padding on H5: `18px 12px 44px`
- Gap between major panels: `16px`
- Standard panel padding: `20px`
- Standard panel radius: `24px`

## Hero block

- Hero top padding should feel looser than normal content panels
- Small eyebrow title:
  - top spacing above eyebrow: about `8px`
  - bottom spacing below eyebrow: about `10px`
- Gap between hero title and slogan: about `12px`
- Toolbar under slogan:
  - top spacing after slogan: about `12px`
  - spacing between toolbar buttons: `8px`

Rule:
The hero should read top-to-bottom in this order:
eyebrow -> title -> slogan -> light action row

Do not let toolbar buttons float higher than the slogan.

## Section title rhythm

- Section header bottom spacing before first content block: `18px`
- If a section has an error notice, add stronger separation before the next form block
- Error notice bottom spacing before next title/input group: `28px`

Rule:
Titles should never feel attached to the block above them.

## Form spacing

- Normal field bottom spacing: `18px`
- Gap between label and input: `10px`
- Gap between horizontally grouped controls: `12px`
- Checkbox group bottom spacing: `24px`
- Preview box:
  - top spacing before preview: `8px`
  - bottom spacing before submit button: `22px`
- Form action row top spacing: `8px`

Rule:
Inside one form area, the visual rhythm should be:
label/input -> validation or helper -> next field

The submit button should never feel stuck to the preview or helper area.

## Notice and helper blocks

- Standard notice padding: `18px 20px`
- Notice top spacing after action row or link area: `12px`
- Consecutive lines inside a notice: `6px`
- Empty-state and preview blocks use the same padding family as notices

Rule:
Informational blocks should sit as their own layer, not touch buttons or titles too tightly.

## Table sections

- Table shell should be separated from section title by the standard section gap
- Table cell padding: `15px 16px`
- Gap between action buttons inside tables: `10px` to `12px`
- When a table follows a button row, leave at least `24px` vertical spacing

Rule:
Tables are the main review surface. They should look calmer and denser than hero areas, but not cramped.

## Share section

- Button row bottom spacing before notice or link block: `26px`
- Notice block top spacing after share button row: `12px`

Rule:
Share actions should feel like a final action zone with extra breathing room.

## Buttons

- Primary / secondary regular buttons:
  - padding: about `14px 20px`
- Small top-right utility buttons:
  - padding: about `9px 12px` or `9px 14px`
- Gap between buttons in one row: `8px` to `12px`

Rule:
Top-right utility actions must always be visually lighter than primary task buttons.

## What to avoid

- Do not place one new title immediately after a notice without extra spacing
- Do not stack multiple controls with only `8px` spacing unless they are clearly part of one mini-toolbar
- Do not use oversized buttons in helper or utility areas
- Do not let one section combine multiple spacing systems

## Future feature rule

When adding a new module, choose the closest existing pattern first:

- hero-like intro block
- form block
- notice block
- table block
- action/share block

Match its spacing to that pattern before inventing new values.
