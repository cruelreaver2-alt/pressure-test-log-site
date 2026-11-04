# Conversion tracking

Two measurement tools are on the marketing site. The page is not cookieless overall.

Cloudflare Web Analytics is enabled. The beacon is in `index.html`, immediately before `</body>`. It is cookieless and privacy-friendly, and it collects no personal data.

Google Tag Manager container `GTM-NL8QNCQ9` is installed with the official snippet: the head script high in `<head>`, and the noscript iframe immediately after `<body>`. Consent Mode v2 defaults to denied for `ad_storage`, `ad_user_data`, `ad_personalization`, and `analytics_storage` before Tag Manager loads. A stored choice in `localStorage` (`ptl-consent`) is applied before Tag Manager loads. Accept grants those four settings. Reject keeps them denied. Google Tag Manager and Google Ads cookies are used to measure ad performance only after accept. The banner and the footer “Cookie choices” control are on the page. There is no third-party consent platform.

## The beacon and Tag Manager

`_headers` does not set a Content-Security-Policy, so neither tag is blocked by one. If a policy is added later, allow:

- `script-src`: `https://static.cloudflareinsights.com`, `https://www.googletagmanager.com`
- `connect-src`: `https://cloudflareinsights.com`, `https://www.google-analytics.com`, `https://www.googletagmanager.com`, `https://*.google.com`, `https://*.doubleclick.net`, `https://googleads.g.doubleclick.net`, `https://www.googleadservices.com`
- `img-src` and `frame-src`: `https://www.googletagmanager.com`, `https://www.google-analytics.com`, `https://*.google.com`, `https://*.doubleclick.net`, `https://googleads.g.doubleclick.net`, `https://www.googleadservices.com`

## Click identifiers

These attributes are stable. The page script does not send them to Google. A tag inside the Tag Manager container can use them after consent:

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

Google Ads conversion tags belong in the Tag Manager container, not as a second snippet in the page. They should fire only after consent is granted. The privacy note is the “Cookies on this page” section.

Production is already served at https://pressure-test-log-site.pages.dev. A merge to `main` updates that site. The tags below stay unset until a custom domain is connected.

## After the domain is connected

Set the absolute canonical URL, `og:url`, and absolute `og:image` / `twitter:image` URLs. The placeholders are marked `CANONICAL` in `index.html`. Root-relative image paths work on the site itself; many social crawlers need an absolute image URL.
