# Photo Journal

A static, client-rendered photo journal built with Vite, React, React Photo Album, and Yet Another React Lightbox.

## Photo Layout

Photos live in `public/photos` and are grouped by folder:

```txt
public/photos/
  glen-ellen-preserve/
    2026-06-21-blue-flowers--nature.jpeg
    2026-06-21-bird-on-the-fence--nature--animals.jpeg
```

The folder becomes the album section. The filename format is:

```txt
YYYY-MM-DD-title-slug--tag-one--tag-two.jpeg
```

Run this after adding or renaming images:

```bash
npm run sync:photos
```

To copy from an external folder and regenerate metadata:

```bash
npm run sync:photos -- /Users/jasonlaster/Desktop/photos
```

The sync script writes `src/galleryData.js`, including image dimensions, titles, dates, and hashtags.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
