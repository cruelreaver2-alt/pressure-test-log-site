# Conversion tracking

No analytics tag, advertising tag, or cookie banner is installed. The marketing site does not call a third party.

## Where to add a tag

In `index.html`, paste the tag in the comment marked `Conversion tracking`, immediately before `</head>`.

If you add a Content-Security-Policy later, allow the tag’s host in that policy. `_headers` does not set a CSP today, so a new tag is not blocked by one.

## Click identifiers

These attributes are stable and are not wired to any script:

| Element | id | data-cta |
| --- | --- | --- |
| Header button | `cta-nav-explore` | `explore-app` |
| Hero primary | `cta-hero-explore` | `explore-app` |
| Hero secondary | `cta-hero-sample` | `sample-report` |
| Sample PDF download | `cta-sample-download` | `sample-report` |
| Sample section, open the app | `cta-sample-explore` | `explore-app` |
| Pilot section | `cta-pilot-explore` | `explore-app` |
| Footer | `cta-footer-explore` | `explore-app` |

`explore-app` goes to `https://pressure-test-log.vercel.app/`. `sample-report` is either the on-page sample (`#sample`) or the PDF download.

For Google Ads, a typical setup is a conversion on the `explore-app` click, and optionally a second conversion on `sample-report`. Add that listener in the same head comment, or in `js/site.js`, when you are ready. Do not add it before you have a tag ID and a privacy notice.

## After the domain is connected

Set the absolute canonical URL, `og:url`, and absolute `og:image` / `twitter:image` URLs. The placeholders are marked `CANONICAL` in `index.html`. Root-relative image paths work on the site itself; many social crawlers need an absolute image URL.
