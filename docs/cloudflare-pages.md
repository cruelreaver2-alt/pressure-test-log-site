# GitHub and Cloudflare Pages

Production is not published. The GitHub repository is public:

https://github.com/cruelreaver2-alt/pressure-test-log-site

Default branch: `main`. It must contain only this marketing site. Nothing private may be added: no tokens, no `.env` files, no private app source, and no customer data. The sample report is labelled example data. Do not connect a domain until the launch checklist says so.

The public site is the `dist/` folder produced by `bash build.sh`. Design, copy, screenshots, and the sample PDF are copied unchanged. Docs, `serve.py`, and `build.sh` stay in git and are not part of the upload.

## Build settings

Use these when the Pages project is created. Framework preset: **None**.

| Setting | Value |
| --- | --- |
| Production branch | `main`. `production_deployments_enabled` is false until a later, separate approval. |
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
| `production_deployments_enabled` | `false` |
| `preview_deployment_setting` | `all` |
| Preview URL | `https://<branch>.pressure-test-log-site.pages.dev` |

A `/` in a branch name is a `-` in that hostname. The preview for `cursor/hero-subhead-65eb` is `https://cursor-hero-subhead-65eb.pressure-test-log-site.pages.dev`.

Leave **Settings → Builds & deployments → Configure Production deployments** off. **Configure Preview deployments** stays **All non-production branches**. Do not put an API token in this repository, in a commit, or in a Pages environment variable. The project has no environment variables.

## Preview workflow

1. Branch from `main`. Do not push the branch’s commits straight to `main`. **Protect Main** rejects that push.
2. Open a pull request into `main`.
3. Cloudflare builds a preview at `https://<branch>.pressure-test-log-site.pages.dev` and can post that URL on the pull request (Pages → Settings → Builds & deployments → pull request comments). The same deployment is listed under **Deployments** with environment **Preview**.
4. Review the preview. Production is unchanged while `production_deployments_enabled` is false.
5. Merge the pull request when it is approved. The merge updates `main` and does not publish production.

Skipping a build: put `[skip ci]` in the commit message. Use that sparingly. Docs-only commits still match the build, and that is acceptable.

## Launch

Still to do, in this order:

1. Check the preview for pull request #1, then merge https://github.com/cruelreaver2-alt/pressure-test-log-site/pull/1 into `main`. Production stays unpublished.
2. After a separate approval, publish that `main` commit. Either turn **on** “Enable automatic production branch deployments” (**Settings → Builds & deployments → Configure Production deployments**) or trigger one production deployment of the approved commit. Do not do this in the same step as the merge.
3. A custom domain comes later, and only as its own decision. After a domain is connected, set the canonical URL and absolute Open Graph image URLs at the `CANONICAL` comment in `index.html`.

The production hostname, once a production deployment exists, is `pressure-test-log-site.pages.dev`.

## Rollback

Use both. They do different jobs.

**Pages, immediate.** Workers & Pages → the project → **Deployments**. On a successful production deployment, open its three-dot menu and choose **Rollback to this deployment**, then confirm. Preview deployments are not rollback targets. The previous build becomes production again. Git is unchanged, so the next production build will replace the rollback unless the bad commit is also reverted.

**Git, durable.** On a new branch, `git revert <bad-commit-sha>`, push, and merge the pull request. That puts `main` back. If production deployments are on, the merge builds a new production deployment of the reverted tree. If they are still held, merge first, check the preview, then promote as in Launch.

Do not force-push `main`. Branch protection blocks it, and a force-push would not roll back the Pages deployment by itself.

## Future maintenance

- Edit the page in `index.html`, `css/`, `js/`, and `assets/`. Do not edit `dist/`; the next build overwrites it.
- Every link to the app must stay `https://pressure-test-log.vercel.app/`, including the JSON-LD `url`. `index.html` has five of those links, plus the `url` in the JSON-LD block.
- Screenshots and `assets/sample/sample-pressure-test-record.pdf` are the real sample. Replace them only with new output from the app, and keep the example-data label.
- A tracking tag, if one is added later, goes in the head comment described in `docs/tracking.md`. None is installed.
- No environment variables and no Node packages. The build is `bash build.sh`.
- `_headers` and `_redirects` must remain in the repo root so `build.sh` copies them into `dist/`.

## Publishing checklist

Done:

- [x] Public repository https://github.com/cruelreaver2-alt/pressure-test-log-site. Nothing private may be added.
- [x] Ruleset **Protect Main** is Active on `main`: pull request required, force-push blocked, deletion blocked, bypass list empty
- [x] Pages project `pressure-test-log-site` is Git-connected, not Direct Upload
- [x] Build command `bash build.sh`, output directory `dist`, framework preset None
- [x] Production branch is `main`, and `production_deployments_enabled` is false
- [x] Previews are on for all non-production branches. URL pattern `https://<branch>.pressure-test-log-site.pages.dev`
- [x] No custom domain is connected

Remaining before launch:

- [ ] Preview for pull request #1 checked: page, sample PDF, and the five app links
- [ ] Pull request #1 merged into `main`. That merge does not publish production.
- [ ] A separately approved production deployment of that `main` commit: enable production deployments, or trigger one deployment
- [ ] Domain later. Then set the `CANONICAL` tags in `index.html`
