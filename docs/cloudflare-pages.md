# GitHub and Cloudflare Pages

This site is not deployed. The GitHub repository is private:

https://github.com/cruelreaver2-alt/pressure-test-log-site

Default branch: `main`. It must contain only this marketing site. No tokens, no `.env` files, no private app source, and no customer data. The sample report is labelled example data. Do not connect a domain until the launch checklist says so.

The public site is the `dist/` folder produced by `bash build.sh`. Design, copy, screenshots, and the sample PDF are copied unchanged. Docs, `serve.py`, and `build.sh` stay in git and are not part of the upload.

## Build settings

Use these when the Pages project is created. Framework preset: **None**.

| Setting | Value |
| --- | --- |
| Production branch | `main`. Leave automatic production deployments off until Kenneth approves. See below. |
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

The repository is private: https://github.com/cruelreaver2-alt/pressure-test-log-site, default branch `main`. It was created empty. Do not add a GitHub README, license, or `.gitignore` on top of this tree, or the first push will need a merge.

Push `main` from this checkout only when asked. Do not force-push. A private repository is still the wrong place for secrets or the private application source.

## 2. Branch protection on `main`

On GitHub, open the repository and click **Settings**. In the left sidebar, under **Code, planning, and automation**, click **Rules**, then **Rulesets**. Click **New ruleset**, then **New branch ruleset**.

- **Ruleset name:** `Protect main`
- **Enforcement status:** **Active**. The form opens on **Disabled**. Click **Disabled** and choose **Active**. A disabled ruleset does not block pushes.
- **Bypass list:** leave it empty. Do not add repository admins, so nobody can push past the rules.
- **Target branches:** click **Add target**, then **Include by pattern**, and enter `main`. While `main` is the default branch, **Include default branch** is the same target.
- Under **Branch protections**, confirm these and leave the others off:
  - **Restrict deletions** (on by default; leave it on)
  - **Block force pushes** (on by default; leave it on)
  - **Require a pull request before merging**
    - Required approvals: **0** while Kenneth is the only maintainer. That still rejects a direct `git push` to `main`. He opens a pull request and merges it himself. Set approvals to **1** only when someone else must sign off.

Click **Create**.

Classic branch protection, from **Settings → Branches** (same sidebar group): click **Add classic branch protection rule**. If that button is not there, click **Add branch protection rule**.

- Branch name pattern: `main`
- Enable **Require a pull request before merging**. Leave **Require approvals** unchecked, so the count stays 0, unless someone other than Kenneth must sign off.
- Enable **Do not allow bypassing the above settings**
- Leave **Allow force pushes** unchecked
- Leave **Allow deletions** unchecked
- Click **Create** (or **Save changes** if you are editing an existing rule)

Pull requests are how preview deployments get a URL. Direct pushes to `main` will be rejected by GitHub.

## 3. Connect Cloudflare Pages

**Workers & Pages → Create → Pages → Connect to Git → GitHub.** Install or approve the Cloudflare GitHub app on the new repository only.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `bash build.sh` |
| Build output directory | `dist` |
| Framework preset | None |

The create form only lists branches that already exist. `main` is the only one, so select it. Do not create a `production` branch.

A project created with `main` as the production branch can start one production build immediately. That build is not a launch. Do not attach a domain to it, and do not treat the `*.pages.dev` hostname as the public site.

Then open the project → **Settings → Builds & deployments**:

- **Configure Production deployments:** turn **off** “Enable automatic production branch deployments”, then **Save**. Leave that control off until Kenneth approves a launch. Do not turn it back on, and do not create a `production` branch, before he does.
- **Configure Preview deployments:** **All non-production branches**.

Preview deployments of other branches, and the preview URL Cloudflare posts on a pull request, keep running while production deployments are off.

This project uses Git integration, not Direct Upload. A Git-integrated Pages project cannot be switched to Direct Upload later.

## Preview workflow

1. Branch from `main`. Do not commit to `main` locally and push it; GitHub will refuse the push once protection is on.
2. Open a pull request into `main`.
3. Cloudflare builds a preview and posts the URL on the pull request when PR comments are enabled (Pages → Settings → Builds & deployments → pull request comments). The same deployment is listed under **Deployments** with environment **Preview**.
4. Review the preview. Production is unchanged.
5. Merge the pull request. With automatic production deployments off, that merge does not publish production. The preview URL belongs to the pull-request branch. Production stays where it is until Kenneth approves the launch step.

Skipping a build: put `[skip ci]` in the commit message. Use that sparingly. Docs-only commits still match the build, and that is acceptable.

## Launch

Only after Kenneth approves the preview:

1. Open **Settings → Builds & deployments → Configure Production deployments**.
2. Turn **on** “Enable automatic production branch deployments” with production branch `main`, then **Save**. That deploys the current `main`.
3. Or, if you would rather publish from a separate branch, push the approved `main` commit to a new branch named `production`, set that as the production branch, turn automatic production deployments on, and **Save**.

Do not do either step before Kenneth approves. The production hostname is `<project>.pages.dev`. Do not attach a custom domain in the same step unless that is an explicit decision. After a domain is connected, set the canonical URL and absolute Open Graph image URLs at the `CANONICAL` comment in `index.html`.

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

- [ ] Private repository https://github.com/cruelreaver2-alt/pressure-test-log-site stays free of secrets and private source
- [ ] `main` pushed to that repository when asked, without a force-push
- [ ] GitHub ruleset on `main`: pull request required, force-push and deletion blocked, bypass list empty
- [ ] Pages project connected to that GitHub repository (Git integration, not Direct Upload)
- [ ] Build command `bash build.sh`, output directory `dist`, framework preset None
- [ ] Automatic production deployments are off, and they stay off until Kenneth approves
- [ ] Production branch is `main` (do not create `production` before he approves)
- [ ] Preview deployments: all non-production branches, including pull requests
- [ ] A pull request produced a preview URL, and production was not updated
- [ ] Preview checked: page, sample PDF, and the five app links
- [ ] Custom domain not connected
- [ ] Launch is a separate step: point production at the approved commit, then consider the domain and the `CANONICAL` tags
