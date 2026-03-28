# Changelog

All notable product-facing changes for Splits should be recorded in this file.

## V101 - 2026-03-28

Visual refinement release focused on typography and spacing consistency.

### Updated

- Chinese UI font switched to `Microsoft YaHei`
- English UI font switched to `Nunito Sans`
- Buttons, cards, form fields, and section spacing were normalized to a cleaner rounded visual system
- Overall interface styling shifted closer to the provided reference direction, with cooler blue-white surfaces and more consistent padding rhythm

## V102 - 2026-03-28

H5-oriented layout cleanup and table-based review update.

### Updated

- Reworked the page into a more mobile-first single-column layout
- Added a concise top-of-page usage flow introduction
- Converted participant display into a table
- Converted expense review into a table
- Converted summary into a table
- Removed the JSON export entry from the page
- Added a written H5 spacing guideline so future features follow the same visual rhythm

## V100 - 2026-03-28

Initial public MVP release.

### Added

- Single-page React + Vite + TypeScript app for activity-based bill splitting
- Activity creation with editable participant list
- Expense add, edit, and delete flows
- Equal split calculation across selected participants
- Per-person summary for paid, owed, and net balances
- Final settlement suggestions showing who should pay whom
- Expense review list for input verification
- Browser `localStorage` auto-save
- JSON export and import
- Shareable snapshot links that reconstruct activity state in the browser
- English / Chinese language switch with Chinese as the default language

### Deployment

- Public site published on GitHub Pages
- Current production URL: `https://xgreta.github.io/Splits/`

### Notes

- This release is intentionally front-end only
- No backend, auth, database, or real-time collaboration
- Share links are snapshot-based, not live sync
- Some users may experience inconsistent `github.io` access depending on network conditions
