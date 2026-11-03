# GitHub and Cloudflare Pages

This site is not deployed. The GitHub repository is public:

https://github.com/cruelreaver2-alt/pressure-test-log-site

Default branch: `main`. Because the repository is public, it must contain only this marketing site. No tokens, no `.env` files, no private app source, and no customer data. The sample report is labelled example data. Do not connect a domain until the launch checklist says so.

The public site is the `dist/` folder produced by `bash build.sh`. Design, copy, screenshots, and the sample PDF are copied unchanged. Docs, `serve.py`, and `build.sh` stay in git and are not part of the upload.

## Build settings

Use these when the Pages project is created. Framework preset: **None**.

| Setting | Value |
| --- | --- |
| Production branch | `production` until launch, then `main`. See below. |
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

The public repository is https://github.com/cruelreaver2-alt/pressure-test-log-site with default branch `main`. It was created empty. Do not add a GitHub README, license, or `.gitignore` on top of this tree, or the first push will need a merge.

Push `main` from this checkout only when asked. Do not force-push. Anything pushed there is world-readable, so keep secrets and the private application source out.

## 2. Branch protection on `main`

In the GitHub repository: **Settings → Rules → Rulesets → New ruleset → New branch ruleset**.

- Enforcement status: **Active**
- Target: branch name `main` (or the default branch, once `main` is the default)
- Bypass list: empty, so admins cannot push either
- Rules:
  - **Require a pull request before merging**
  - Required approvals: **0** if Kenneth is the only maintainer. That still rejects a direct `git push` to `main`, and he can open a pull request and merge it himself. Set approvals to **1** only when someone else must sign off.
  - **Block force pushes**
  - **Restrict deletions**

Classic branch protection is the same idea: **Settings → Branches → Add branch ruleset** or **Add classic branch protection rule** for `main`, enable “Require a pull request before merging”, and enable “Do not allow bypassing the above settings”.

Pull requests are how preview deployments get a URL. Direct pushes to `main` will be rejected by GitHub.

## 3. Connect Cloudflare Pages

**Workers & Pages → Create → Pages → Connect to Git → GitHub.** Install or approve the Cloudflare GitHub app on the new repository only.

| Setting | Value |
| --- | --- |
| Production branch | `production` |
| Build command | `bash build.sh` |
| Build output directory | `dist` |
| Framework preset | None |

`production` does not exist yet. Do not create it. With that as the production branch, pushes to `main` and to pull-request branches are preview deployments, not production.

Then open the project → **Settings → Builds & deployments**:

- **Configure Production deployments:** production branch remains `production`. Leave “Enable automatic production branch deployments” on, so that the day you do create `production`, it deploys. Until that branch exists, there is nothing for it to deploy.
- **Configure Preview deployments:** **All non-production branches**.

If the create form will not accept a branch that does not exist, use `main` as the production branch and, in the same settings screen, turn **off** “Enable automatic production branch deployments”, then save. Do that before treating any `*.pages.dev` URL as intentional. A project created with `main` as the production branch can start one production build immediately. The unused-branch setup avoids that.

Preview deployments of other branches keep running either way.

This project uses Git integration, not Direct Upload. A Git-integrated Pages project cannot be switched to Direct Upload later.

## Preview workflow

1. Branch from `main`. Do not commit to `main` locally and push it; GitHub will refuse the push once protection is on.
2. Open a pull request into `main`.
3. Cloudflare builds a preview and posts the URL on the pull request when PR comments are enabled (Pages → Settings → Builds & deployments → pull request comments). The same deployment is listed under **Deployments** with environment **Preview**.
4. Review the preview. Production is unchanged.
5. Merge the pull request. With production branch `production`, merging to `main` updates the `main` preview only.

Skipping a build: put `[skip ci]` in the commit message. Use that sparingly. Docs-only commits still match the build, and that is acceptable.

## Launch

When the preview is approved and you mean to publish:

1. Either change the production branch to `main` (**Settings → Builds & deployments → Configure Production deployments**), which deploys the current `main`,
2. Or push the approved `main` commit to a new branch named `production`.

The production hostname is `<project>.pages.dev`. Do not attach a custom domain in the same step unless that is an explicit decision. After a domain is connected, set the canonical URL and absolute Open Graph image URLs at the `CANONICAL` comment in `index.html`.

## Rollback

Use both. They do different jobs.

**Pages, immediate.** Workers & Pages → the project → **Deployments**. Filter to Production. On the last good deployment, open the menu and choose **Rollback to this deployment**. The previous build becomes production again. Git is unchanged, so the next production build from `main` or `production` will replace the rollback unless the bad commit is also reverted.

**Git, durable.** On a new branch, `git revert <bad-commit-sha>`, push, and merge the pull request. That puts `main` back. If production deployments are on, the merge builds a new production deployment of the reverted tree. If they are still held, merge first, check the preview, then promote as in Launch.

Do not force-push `main`. Branch protection blocks it, and a force-push would not roll back the Pages deployment by itself.

## Future maintenance

- Edit the page in `index.html`, `css/`, `js/`, and `assets/`. Do not edit `dist/`; the next build overwrites it.
- Every link to the app must stay `https://pressure-test-log.vercel.app/`, including the JSON-LD `url`. There are five of them in `index.html`.
- Screenshots and `assets/sample/sample-pressure-test-record.pdf` are the real sample. Replace them only with new output from the app, and keep the example-data label.
- A tracking tag, if one is added later, goes in the head comment described in `docs/tracking.md`. None is installed.
- No environment variables and no Node packages. The build is `bash build.sh`.
- `_headers` and `_redirects` must remain in the repo root so `build.sh` copies them into `dist/`.

## Publishing checklist

- [ ] Public repository https://github.com/cruelreaver2-alt/pressure-test-log-site stays free of secrets and private source
- [ ] `main` pushed to that repository when asked, without a force-push
- [ ] GitHub ruleset on `main`: pull request required, force-push and deletion blocked, bypass list empty
- [ ] Pages project connected to that GitHub repository (Git integration, not Direct Upload)
- [ ] Build command `bash build.sh`, output directory `dist`, framework preset None
- [ ] Production branch is `production` and that branch does not exist, or automatic production deployments are off
- [ ] Preview deployments: all non-production branches
- [ ] A pull request produced a preview URL, and production was not updated
- [ ] Preview checked: page, sample PDF, and the five app links
- [ ] Custom domain not connected
- [ ] Launch is a separate step: point production at the approved commit, then consider the domain and the `CANONICAL` tags
