# Conversion tracking

Cloudflare Web Analytics is enabled. The beacon is in `index.html`, immediately before `</body>`. It is cookieless and privacy-friendly, and it collects no personal data. No advertising tag and no cookie banner is installed.

## The beacon

`_headers` does not set a Content-Security-Policy. If one is added later, `script-src` must include `https://static.cloudflareinsights.com` and `connect-src` must include `https://cloudflareinsights.com`.

## Click identifiers

These attributes are stable and are not wired to the analytics beacon:

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

For Google Ads, a typical setup is a conversion on the `explore-app` click, and optionally a second conversion on `sample-report`. Add that listener in the head comment marked `Conversion tracking`, or in `js/site.js`, when you are ready. Do not add it before you have a tag ID and a privacy notice.

## After the domain is connected

Set the absolute canonical URL, `og:url`, and absolute `og:image` / `twitter:image` URLs. The placeholders are marked `CANONICAL` in `index.html`. Root-relative image paths work on the site itself; many social crawlers need an absolute image URL.
