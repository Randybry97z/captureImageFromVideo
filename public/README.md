# Public Folder

This folder contains static assets that are served directly by Next.js.

## Usage

Files placed in this folder are accessible at the root URL path:
- `public/favicon.ico` → accessible at `/favicon.ico`
- `public/images/logo.png` → accessible at `/images/logo.png`
- `public/robots.txt` → accessible at `/robots.txt`

## Common Files

- **favicon.ico**: Website icon (browser tab icon)
- **robots.txt**: Search engine crawler instructions
- **images/**: Static images, icons, logos
- **fonts/**: Custom fonts (if any)

## Notes

- Files in this folder are not processed by Next.js bundler
- They are served as-is with appropriate MIME types
- Use this folder for assets that don't need to be optimized or bundled

