# Personal portfolio — first edition

A local-only, responsive portfolio built with HTML and CSS. No installation, build step, external fonts, JavaScript, analytics, or third-party requests.

## Preview

Open `index.html` directly in a browser, or run from this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then visit http://127.0.0.1:4173.

## Personalize before publishing

All visible personal information is intentionally left as placeholders. The project illustrations are layout examples, not claims of completed work.

In `index.html`, update:

- Name in the header and footer; page title and description in the head.
- Hero introduction to reflect your professional focus.
- Both project summaries, tags, and illustrations with real project evidence. Add repository or case-study links when available.
- About text, background, and core skills.
- Contact block with LinkedIn, GitHub, and/or an email link. Add a résumé link only when a real file is available.
- Local preview labels before publication.

Colours, typography, spacing, and responsive rules are in `styles.css`. The layout uses local system fonts and Georgia so it works offline.

## GitHub Pages later

The site is static and uses relative asset paths, suitable for a personal or project GitHub Pages site. Once content is ready, push these files to the chosen repository and enable Pages from its publishing branch. No credentials, repository setup, or publication have been performed.
