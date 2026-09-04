# Intelo webfonts

Intelo (Fontfabric) — the Sleepwell brand face. All 16 styles are installed
and declared in `styles.css` under a **single** `Intelo` family, so ordinary
CSS resolves them:

```css
font-weight: 600;                        /* SemiBold */
font-weight: 700; font-style: italic;    /* Bold Italic */
```

## Weight ramp

| Weight | Style | Roman | Italic |
| --- | --- | --- | --- |
| 100 | Hairline  | `Intelo-Hairline`  | `Intelo-HairlineItalic` |
| 200 | Thin      | `Intelo-Thin`      | `Intelo-ThinItalic` |
| 300 | Light     | `Intelo-Light`     | `Intelo-LightItalic` |
| 400 | Regular   | `Intelo-Regular`   | `Intelo-Italic` |
| 500 | Medium    | `Intelo-Medium`    | `Intelo-MediumItalic` |
| 600 | SemiBold  | `Intelo-SemiBold`  | `Intelo-SemiBoldItalic` |
| 700 | Bold      | `Intelo-Bold`      | `Intelo-BoldItalic` |
| 800 | ExtraBold | `Intelo-ExtraBold` | `Intelo-ExtraBoldItalic` |

Each is present as `.woff2` (primary) and `.woff` (legacy fallback).

## Why not the vendor's stylesheet.css

The supplied kit is a Font Squirrel conversion, and the conversion flattened
every `OS/2 usWeightClass` to 400. To work around its own damage the vendor
sheet splits the family into `Intelo`, `Intelo Hairline`, `Intelo Semi` and
`Intelo Extra`, which means `font-weight: 600` does nothing and you have to
swap `font-family` to change weight.

Our declarations assign the ramp explicitly instead, so weight behaves
normally and `<strong>`/`<b>` inherit correctly. The ordering above was
verified by rendering a specimen, not taken from the (unusable) metadata.

## Runtime cost

Declaring all 16 is free. Browsers fetch a face only when a rule actually
renders text in it — this screen downloads exactly two files (400 and 700,
~66 KB combined). `font-display: swap` paints fallback text immediately and
reflows when Intelo arrives.

## Licensing

Intelo is a commercial face. Webfont embedding is a separate licence from
desktop use — confirm the brand licence covers `@font-face` delivery, and
check for any monthly pageview cap, before deploying publicly.
