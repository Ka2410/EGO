# EGO — Playable Streetwear Prototype

Static front-end prototype for the EGO local streetwear brand.

## Included
- Cinematic warehouse-style hero built with CSS.
- 8 supplied metallic fashion character assets.
- Mouse drag, touch swipe, trackpad horizontal scroll, and keyboard arrow controls.
- Character metadata and progress state update with each look.
- New Drop grid linked to character selection.
- Working bag drawer with add/remove interactions.
- Responsive mobile navigation.

## Run
Because this is a static site, you can open `index.html` directly in a browser. For local development, any static server works, for example:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080` from inside the `ego-site` folder.

## Backend integration points
- Product catalog / inventory
- Search overlay
- Checkout / payment
- User account
- Real cart persistence
- CMS for drop metadata and campaign copy
