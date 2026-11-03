# Technical report

Marketing site for Pressure Test Log. Static files only. The Pressure Test Log application was not modified, and nothing was published.

Reviewed against the live app at `https://pressure-test-log.vercel.app/` on 3 November 2026. The application source was not in this marketing repository, so the check is the deployed app: the HTML document, the bundles it loads, and the screens and PDF produced by driving that app in Chrome. This marketing repository is private.

The HTML document was last modified `Tue, 03 Nov 2026 10:49:06 GMT`. The screen language was already English by default.

## Structure

| Path | Role |
| --- | --- |
| `index.html` | The page. One H1, section anchors, SEO and Open Graph tags, JSON-LD. |
| `css/site.css` | Layout, type, and the three widths. |
| `js/site.js` | Opens and closes the mobile menu. No network calls. |
| `fonts/` | IBM Plex Sans, Latin, weights 400, 500, and 600. Self-hosted. |
| `assets/screenshots/` | WebP stills from the live app, plus an 800px-wide alternate. |
| `assets/sample/` | Example PDF and renders of its two pages. |
| `assets/og.png`, `favicon.svg`, `apple-touch-icon.png` | Sharing image and icons. |
| `_headers` | Cache and security headers for Cloudflare Pages. |
| `robots.txt` | Allows crawling. Sitemap is left unset until a domain exists. |
| `serve.py` | Local preview on port 4178. Pages does not run it. |
| `docs/cloudflare-pages.md` | Publish steps. Not carried out. |
| `docs/tracking.md` | Where a tag would go. None is installed. |

There is no build step and no server function. Preview with `python3 serve.py`.

## Verified claims

Every product sentence on the page comes from the deployed app. “Bundle” means `https://pressure-test-log.vercel.app/assets/index-oj50PFHC.js`. “PDF module” means `assets/pdf-BV-pEjmp.js`.

| Claim on the page | Where it was checked |
| --- | --- |
| English is the default screen language. Norsk is available. The choice is stored on the device and changes screen text only. | HTML sets `lang` from `localStorage` key `ptl.locale`, and falls back to English. Bundle strings `language.en` / `language.nb` and `language.help`: “This sets the screen language. PDF language is chosen when the record is shown.” Switching to Norsk in the live app changed the Settings heading to “Innstillinger”. |
| PDF language is chosen when the record is shown, English or Norwegian. | Bundle `pdf.docLanguage`. The signed record in the live app shows PDF language buttons “English” and “Norsk”, separate from the sidebar control. |
| Pressure units are bar(g), psi(g), MPa(g), and kPa(g). The unit is stored. Numbers are not converted. Changing the unit clears entered pressures. | Bundle array `` ro=[`bar(g)`,`psi(g)`,`MPa(g)`,`kPa(g)`] ``. String `pressure.hint`: “Stored with the readings. The app does not convert between units.” String `pressure.changeBody`: “The recorded pressures will be cleared. The numbers are not converted.” The live select lists those four units. Gauge range uses the same list. |
| An older record with no stored unit is shown as bar(g). The numbers stay as they were. | Bundle `pressure.legacy`. |
| The app does not calculate allowable pressure, hold period, or acceptance criteria. | Bundle `disclaimer`, repeated on the PDF as `doc.disclaimer`. The same sentence is on the live Settings screen. |
| It does not certify a test and does not check ASME, EN, or any other code. | The bundle has no standards checker and no occurrence of “ASME”. Accepted and Rejected are operator-entered results (`fields.approved` / `fields.rejected`). The page states the limit in those words. It is not a feature the app claims. |
| Jobs hold project number, client, location, and an optional description that is not its own field on the record. | Bundle `jobs.*`. A job was created in the live app and the description stayed on the job. |
| A test records line or system number, drawing or isometric, and medium: water, air, nitrogen, or other. | Bundle `fields` and `mediums`. Live buttons: Water, Air, Nitrogen, Other. |
| Design pressure, test pressure, hold period, and initial and final readings are typed in and marked manually recorded. Timestamps are set when a value is entered, or with New timestamp. | Bundle `fields.recorded`, `fields.stamp`, `pressure.manual`. Live readings screen. |
| Hold period is not calculated from the timestamps. If the recorded hold is longer than the time between readings, the app notes it and does not change the number. | Bundle `fields.holdHint` and `pressure.holdExceeds`. Function `wm` compares the entered minutes with the timestamp interval. Seen on the live form before the sample timestamps were aligned, then absent from the PDF once the interval was 32 minutes and the hold was 30. |
| Ambient and medium temperature are optional. A comment is required when the result is rejected. | Bundle `fields.optional`, `fields.commentHint`, `issues.resultComment`. |
| Gauge register: ID, type, range, serial, calibration date, due date, certificate number. Types: pressure gauge, digital pressure gauge, pressure transmitter, chart recorder, or another type. | Bundle `instruments.*` and `instrumentTypes`. A gauge was saved in the live register and shown as Valid. |
| Calibration is shown as valid, due soon, or expired. Due soon does not block signing. Expired calibration needs a confirmation and a justification of at least 10 characters, which is locked into the record. | Bundle `calibration.*`, `instruments.expiring`, `instruments.expiredBody`, `instruments.justificationHint`. |
| If the gauge unit differs from the test unit, the operator must acknowledge it. That acknowledgement does not confirm the gauge is suitable. | Bundle `sign.unitAck` and `issues.unitMismatch`. |
| On signing, gauge data is frozen. Later register edits do not change the signed record. | Bundle `instruments.freeze`. The same sentence is on the live Gauges step. |
| Photos: before and after, JPG or PNG, compressed, stored on the device, up to four per moment. | Bundle `photos.*`. The uploader accepts `image/*`. The cap is `4` minus photos of that kind. |
| Signatures are drawn on screen. Operator name, witness name, and witness company are required. The company on the record is the settings company, frozen at signing. It is not the witness. | Bundle `sign.*`. Both signatures were drawn in the live app and appear on the PDF. |
| Signing locks the revision. A correction is a new revision with a reason and a name, signed again. The original is kept. Signed revisions cannot be deleted. A job with signed records cannot be deleted. Drafts can. | Bundle `tests.lockedBody`, `revision.*`, `jobs.deleteConfirm`, `errors.signedCannotDelete`. The live record shows Original and Rev 1, with different SHA-256 values (`a7e946c7…` on the original PDF, `5b6e2de1…` on Rev 1). |
| The PDF is titled Pressure test record and includes a SHA-256 of the canonical signed data, not of the PDF bytes. | Bundle `doc.*` and `pdf.hashHelp`. PDF module exports `buildProtocolPdf` and uses pdf-lib. `pdfinfo` on the sample: title “Pressure test record SAMPLE-2026-014 6"-WC-101”, creator “Pressure Test Log 0.1”, producer pdf-lib, A4, 2 pages. |
| Company name and an optional logo from settings are stored locally and frozen into the revision. | Bundle `settings.company`, `settings.logoHint`, `sign.companyHint`. The sample logo is an example mark made for this page, not a customer. |
| Records stay on the device. There is no sync between people. JSON export and import cover jobs, tests, gauges, and settings. Import replaces what is on the device. | Bundle `settings.storage`, `settings.backupBody`, `settings.importConfirm`. IndexedDB database name `pressure-test-log`, stores `jobs`, `instruments`, `tests`, `settings` (Dexie `version(1)`). |
| After one online visit, the app loads with no network and shows an offline notice. A first visit needs a connection. It can be added to the home screen. Records do not move to another device by installing it. | `sw.js` precaches the app shell, fonts, and PDF bundle (Workbox). Manifest `Pressure Test Log`. Live check: open the app, disable the network, reload. The shell loaded and the banner read “Offline — everything is stored on this device”. Bundle `settings.install`. |
| The hosted app loads Vercel Web Analytics, which can record that the app was opened. The test record is not uploaded by the documentation workflow. There is no account. | The bundle mounts the analytics component at the root (`@vercel/analytics` 2.0.1). No login flow. Settings say data stays on the device. This is not a security certification. |
| Settings can load demo data: one job, two gauges (one with expired calibration), and one signed test. That demo is example data, not a customer. | Bundle `settings.demoBody`. The sample on this page is a separate record, not that demo. |
| No data-logger connection. | No logger, import-from-instrument, or similar control in the UI strings, routes, or PDF module. |

Routes in the bundle are still the Norwegian paths (`/instrumenter`, `/innstillinger`, `/jobber/:jobId`, `/tester/:testId`). The English UI uses those paths. The page does not claim otherwise.

## Screenshots and the sample PDF

Stills were taken in headless Chrome at 1440×1100 while filling the live app.

The sample record:

- Company on the record: “Example contractor (sample data)”
- Project SAMPLE-2026-014, client “Example client (not a real company)”, location “Example fabrication yard”
- Line 6"-WC-101, drawing ISO-SAMPLE-014 rev A, water
- 16 bar(g) design, 24 bar(g) test, 30 min hold, readings 24.0 and 23.8 bar(g)
- Gauge PG-SAMPLE-014, 0–40 bar(g), serial SN-SAMPLE-44821, calibrated 2026-03-12, due 2027-03-12, certificate CAL-SAMPLE-2026-118
- Result accepted, with a comment that it is example data
- Operator A. Example, witness B. Example of “Example inspection (sample)”

The before and after images were generated for this page and labelled “SAMPLE DATA”. They were uploaded through the app’s photo control. They are not photographs from a site.

Reading timestamps in the sample are 16 April 2026, 10:10 and 10:42. The app’s own control stamps the current time and has no historical time picker. Those two timestamps were written into the on-device draft so the 30-minute hold matches the interval, then the app was reloaded, signed, and the PDF was produced by the app. Everything else on the PDF was entered through the screen.

The file you can download is that original signed revision (`assets/sample/sample-pressure-test-record.pdf`, 166,406 bytes). A later revision was signed in the same session, changing ambient temperature from 12 °C to 11 °C. That revision is the screenshot in the “PDF reports and revision history” section. It was not the file downloaded.

WebP screenshots are about 19–57 KB at 1440px wide, with an 800px-wide `srcset` candidate. PDF page renders are WebP at 1100px wide.

## Lighthouse

Lighthouse 13.6.0 against `http://127.0.0.1:4178/` after the final CSS change. Chrome headless.

| Category | Mobile | Desktop |
| --- | --- | --- |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |

An earlier desktop pass scored accessibility 90 because the header button inherited the nav link colour (light grey on amber). That selector is overridden. Footer links were under the 24px target size; they now have a 44px minimum height. Both were remeasured.

Lighthouse still notes that the CSS is not minified (about 2 KB) and that screenshots could be a little smaller. Those notes did not reduce the performance score. The CSS is left readable.

Checked in Chrome at 1440×900, 834×1112, 768×1024, and 390×844: no horizontal overflow, in-page links land below the sticky header, the mobile menu opens and closes, and every `data-cta="explore-app"` link points at `https://pressure-test-log.vercel.app/`. WebP, WOFF2, and PDF are served with the matching content types from `serve.py`. Cloudflare Pages assigns those types from the file extension.

## Known gaps

- Canonical URL, `og:url`, and absolute social-image URLs are unset until a domain is connected. The comment in `index.html` is marked `CANONICAL`.
- `robots.txt` has no sitemap yet, for the same reason.
- No analytics or advertising tag is present. See `docs/tracking.md`.
- The site is not on Cloudflare, and no domain was bought.
- The sample’s reading timestamps were aligned in the on-device draft, as described above.
- The downloadable PDF is the original revision. Revision 1 is shown in a screenshot, not as a second file.
- Offline behaviour was checked by loading the app once and reloading with the network off. A cold start with no cache was not claimed.
- Vercel Web Analytics is described from the bundle (the component is mounted and loads the insights script). The contents of a test record were not observed leaving the browser. This is not a penetration test.
- The application source is not part of this marketing repository. If a later deploy changes the app, these claims need to be checked again.
