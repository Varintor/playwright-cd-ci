# CI/CD & Reporting 

You take the Playwright suite  and make a machine run it. By the
end you have a GitHub Actions workflow that runs on every push and every pull request,
publishes the HTML report as a downloadable artifact, retries only in CI, and records a
trace on the first retry. You then introduce one flaky test, triage it from CI output,
and fix the cause rather than the symptom.

Practice site, as before: **https://www.saucedemo.com**
Credentials: `standard_user` / `secret_sauce`.

Starting point: your existing repository with the login and cart specs and the page
objects from lab 8-10. It must be green locally before you begin.


## Setup

Create a new localrepository in your local computer

```bash
cd your-playwright-lab            # the repository from Lab 8-10
npx playwright test               # confirm the suite is green locally
git status                        # working tree clean, remote configured
```

Push the repository to GitHub with your own account if you have not already:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Start working from that, copy the file in this repo to your file

## Task 1 — the first green pipeline

Create `.github/workflows/playwright.yml`. A gap-fill skeleton is provided in this
folder at the same path — copy it into your repository and fill every blank.


Commit and push:

```bash
git add .github/workflows/playwright.yml
git commit -m "Add Playwright CI workflow"
git push
```

Open the **Actions** tab and watch the run.



Download the artifact from the run summary page, unzip it, and open it:

```bash
npx playwright show-report ./playwright-report
```



## Task 2 — CI-only retries, traces and workers

Edit `playwright.config.ts` so that CI and local runs behave differently. The relevant
lines are given as a skeleton in `playwright.config.skeleton.ts` in this folder; fill
the blanks and merge them into your own config.



## Task 3 — introduce a flaky test, then triage it

Copy `tests/cart-badge.skeleton.spec.ts` from this folder into your `tests/` directory
and complete it as instructed in the file. It deliberately reads the badge text **once**
instead of asserting on the locator, which is one of the two most common causes of
flakiness. Push it and re-run the pipeline several times (an empty commit is enough:
`git commit --allow-empty -m "re-run" && git push`).



Apply the correct fix, push, and confirm the run is green with no flaky results.



## Task 4 



Copy the files from your local repository to the clone repo, push them to submit the first lab



## Provided starter files

| File | Purpose |
|---|---|
| `.github/workflows/playwright.yml` | gap-fill workflow skeleton — fill every `____` |
| `playwright.config.skeleton.ts` | gap-fill CI settings for your existing config |
| `tests/cart-badge.skeleton.spec.ts` | the deliberately flaky test for Task 3 |


## Quick reference

### Workflow file

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload the HTML report
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Key configuration options

| Option | Meaning |
|---|---|
| `workers: process.env.CI ? 4 : undefined` | parallel processes; the default is half the CPU cores |
| `fullyParallel: true` | tests inside one file also run in parallel |
| `retries: process.env.CI ? 2 : 0` | retry in CI only, so a local failure is never hidden |
| `forbidOnly: !!process.env.CI` | fail the build if a `test.only` was committed |
| `reporter: 'html'` | writes a browsable report into `playwright-report/` |
| `reporter: process.env.CI ? 'blob' : 'html'` | partial reports, one per shard, ready to merge |
| `trace: 'on-first-retry'` | record a replayable trace on the retried attempt only |
| `screenshot: 'only-on-failure'` | attach a screenshot at the moment of failure |

### Useful commands

```bash
npx playwright test --workers=1                  # baseline timing
npx playwright test --workers=4 --reporter=list  # parallel timing
npx playwright test --shard=1/4                  # one slice of the suite
npx playwright merge-reports --reporter html ./all-blob-reports
npx playwright show-report ./playwright-report   # open a downloaded artifact
npx playwright show-trace trace.zip              # replay a recorded trace
npx playwright test --grep @flaky                # run only the quarantine list
npx playwright test --grep-invert @flaky         # the blocking run
```

Docs: https://playwright.dev/docs/ci-intro · https://playwright.dev/docs/test-sharding
