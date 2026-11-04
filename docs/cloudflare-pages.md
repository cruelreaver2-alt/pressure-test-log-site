# GitHub and Cloudflare Pages

Production is live at https://pressure-test-log-site.pages.dev. Merging to `main` deploys there automatically. Pull requests and other branches get preview deployments. No custom domain is connected yet. The GitHub repository is public:

https://github.com/cruelreaver2-alt/pressure-test-log-site

Default branch: `main`. It must contain only this marketing site. Nothing private may be added: no tokens, no `.env` files, no private app source, and no customer data. The sample report is labelled example data. A custom domain is not connected yet.

The public site is the `dist/` folder produced by `bash build.sh`. Design, copy, screenshots, and the sample PDF are copied unchanged. Docs, `serve.py`, and `build.sh` stay in git and are not part of the upload.

## Build settings

Use these when the Pages project is created. Framework preset: **None**.

| Setting | Value |
| --- | --- |
| Production branch | `main`. A merge deploys to https://pressure-test-log-site.pages.dev automatically. |
| Build command | `bash build.sh` |
| Build output directory | `dist` |
| Root directory | `/` |
| Environment variables | none |

`build.sh` copies `index.html`, `robots.txt`, `_headers`, `_redirects`, `css/`, `js/`, `assets/`, and `fonts/` into `dist/`. Check it locally:

```bash
bash build.sh
python3 serve.py
```

Open http://127.0.0.1:4178. That process serves `dist/` only.

`_headers` sets nosniff, a referrer policy, framing, a locked-down permissions policy, HSTS (no preload), and cache lifetimes. HTML is not cached. Fonts are cached for a year. `_redirects` sends `/index.html` to `/`.

## What is not in `dist/`

Nothing was deleted from git in the audit. These are kept in the repository and left out of the Pages output:

| Path | Why it stays out of `dist/` |
| --- | --- |
| `docs/` | Setup notes and the verification report. Safe to publish; no credentials. |
| `serve.py` | Local preview only. |
| `build.sh` | The build script itself. |
| `README.md` | Repository readme. |
| `.gitignore` | Git metadata. |

`.gitignore` also excludes `dist/`, `.env` files, virtualenvs, `node_modules/`, `.wrangler/`, `agent-tools/`, editor folders, and OS debris. None of those were present as tracked files. A search of the tree found no API keys, passwords, private keys, or personal email addresses. The sample report is labelled example data.

## 1. GitHub repository

The repository is public: https://github.com/cruelreaver2-alt/pressure-test-log-site, default branch `main`. Anything pushed here can be read by anyone. Nothing private may be added: no secrets, no tokens, no `.env` files, no private application source, and no customer data.

Do not force-push `main`. The ruleset below rejects a direct push.

## 2. Branch protection on `main`

The active ruleset is **Protect Main**. It targets `refs/heads/main`. Enforcement status is **Active**. The bypass list is empty.

Rules on that ruleset:

- **Restrict deletions**
- **Block force pushes**
- **Require a pull request before merging** (required approving reviews: 0)

Direct `git push` to `main` is rejected. Open a pull request. This is already in place; do not add a second ruleset for the same job.

## 3. Cloudflare Pages

The project **pressure-test-log-site** exists and is connected to this GitHub repository. It is Git integration, not Direct Upload. A Git-integrated project cannot be switched to Direct Upload later. No custom domain is attached.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `bash build.sh` |
| Build output directory | `dist` |
| Framework preset | None |
| `production_deployments_enabled` | `true` |
| `preview_deployment_setting` | `all` |
| Production URL | https://pressure-test-log-site.pages.dev |
| Preview URL | `https://<branch>.pressure-test-log-site.pages.dev` |

A `/` in a branch name is a `-` in that hostname. Automatic production deployments are on for `main`. Preview deployments stay on for every other branch and for pull requests. Do not put an API token in this repository, in a commit, or in a Pages environment variable. The project has no environment variables.

## Preview workflow

1. Branch from `main`. Do not push the branch’s commits straight to `main`. **Protect Main** rejects that push.
2. Open a pull request into `main`.
3. Cloudflare builds a preview at `https://<branch>.pressure-test-log-site.pages.dev` and can post that URL on the pull request (Pages → Settings → Builds & deployments → pull request comments). The same deployment is listed under **Deployments** with environment **Preview**.
4. Review the preview. It does not replace production.
5. Merge the pull request. The merge to `main` deploys to production at https://pressure-test-log-site.pages.dev.

Skipping a build: put `[skip ci]` in the commit message. Use that sparingly. Docs-only commits still match the build, and that is acceptable.

## Domain

No custom domain is connected. Production is the `pages.dev` hostname above. When a domain is connected later, set the canonical URL and absolute Open Graph image URLs at the `CANONICAL` comment in `index.html`.

## Rollback

Use both. They do different jobs.

**Pages, immediate.** Workers & Pages → the project → **Deployments**. On a successful production deployment, open its three-dot menu and choose **Rollback to this deployment**, then confirm. Preview deployments are not rollback targets. The previous build becomes production again. Git is unchanged, so the next production build will replace the rollback unless the bad commit is also reverted.

**Git, durable.** On a new branch, `git revert <bad-commit-sha>`, push, and merge the pull request. That puts `main` back, and the merge deploys the reverted tree to production. Use the Pages rollback first if production should change before that merge finishes.

Do not force-push `main`. Branch protection blocks it, and a force-push would not roll back the Pages deployment by itself.

## Future maintenance

- Edit the page in `index.html`, `css/`, `js/`, and `assets/`. Do not edit `dist/`; the next build overwrites it.
- Every link to the app must stay `https://pressure-test-log.vercel.app/`, including the JSON-LD `url`. `index.html` has five of those links, plus the `url` in the JSON-LD block.
- Screenshots and `assets/sample/sample-pressure-test-record.pdf` are the real sample. Replace them only with new output from the app, and keep the example-data label.
- Cloudflare Web Analytics is enabled and cookieless. Google Tag Manager (`GTM-NL8QNCQ9`) loads with Consent Mode denied until the visitor accepts. Google Ads cookies measure ad performance only after that choice. See `docs/tracking.md`.
- No environment variables and no Node packages. The build is `bash build.sh`.
- `_headers` and `_redirects` must remain in the repo root so `build.sh` copies them into `dist/`.

## Publishing checklist

Done:

- [x] Public repository https://github.com/cruelreaver2-alt/pressure-test-log-site. Nothing private may be added.
- [x] Ruleset **Protect Main** is Active on `main`: pull request required, force-push blocked, deletion blocked, bypass list empty
- [x] Pages project `pressure-test-log-site` is Git-connected, not Direct Upload
- [x] Build command `bash build.sh`, output directory `dist`, framework preset None
- [x] Production branch is `main`, and `production_deployments_enabled` is true. A merge deploys to https://pressure-test-log-site.pages.dev
- [x] Previews are on for all other branches and pull requests. URL pattern `https://<branch>.pressure-test-log-site.pages.dev`
- [x] Rollback is available from the Pages deployments list
- [x] No custom domain is connected

Remaining:

- [ ] Custom domain, later. Then set the `CANONICAL` tags in `index.html`
