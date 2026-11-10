# Yeturu Maneesha Portfolio

A responsive personal portfolio built with React, TypeScript, Vite, Tailwind CSS, Three.js / React Three Fiber, GSAP ScrollTrigger, and Lenis.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Notes

- The hero core is generated in Three.js, so no large model download is needed. Its code and runtime load separately from the main page bundle.
- Scroll animation and smooth scrolling are disabled for `prefers-reduced-motion` users. The 3D scene reduces pixel ratio and particle count on small screens.
- The resume download is a plain-text file assembled from the details provided for this portfolio. Replace it with a final PDF when one is available.
- Update the LinkedIn destination in `src/App.tsx` to the personal profile URL.
- The Open Graph preview is supplied as `public/og-card.svg`.