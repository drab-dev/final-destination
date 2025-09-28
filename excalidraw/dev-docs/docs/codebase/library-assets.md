# Library Assets (SVG)

The library menu (`LibraryMenuItems.tsx`) exposes a curated grid of SVG assets located in `excalidraw/public/library-assets`.

## File Naming
File names (including spaces, case, tildes `~`, parentheses, and hyphens) must match exactly between the filesystem and the `svgAssets` array. A recent issue causing all previews to be blank was traced to incorrect `.jpg` extensions being referenced while only `.svg` files existed.

## Adding New Assets
1. Drop the optimized SVG into `excalidraw/public/library-assets/`.
2. Add an entry to the `svgAssets` array with the exact filename.
3. Avoid renaming existing assets casually, as external saved scenes might rely on them.
4. Keep SVGs sanitized (no external scripts, no remote hrefs). Consider adding an automated sanitizer in the future.

## Potential Enhancements
- Auto-generate the `svgAssets` list at build time.
- Add lint step verifying each listed asset exists and is `.svg`.
- Inline SVG for faster perceived load + theming hooks.
- Provide search & categorization metadata.

_Last updated: 2025-09-28_
