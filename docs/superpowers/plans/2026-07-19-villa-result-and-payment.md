# Villa result and payment progress implementation plan

> **For Codex:** Execute this plan directly. The user has confirmed the result and requested deployment.

**Goal:** Convert the public villa voting page into a final-result page announcing 大雪星空 Starry Night, with a static payment-progress sidebar.

**Architecture:** Keep the existing GitHub Pages static site and render the candidate comparison plus payment roster entirely in the browser. Remove all voting controls and Apps Script API use from the page; payment state remains a small front-end constant so later payment confirmations only require an HTML update and redeploy.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node static assertions, GitHub Pages.

---

### Task 1: Lock the final-result contract with a static test

**Files:**
- Modify: `work/check-villa-page.mjs`

**Steps:**
1. Assert that the public entry point still redirects to the villa page.
2. Assert final-result labels, the winning villa, the 11-person roster, the 3,000-dollar payment amount, and zero-progress summary text.
3. Assert that former vote controls and the Apps Script API identifiers are absent from the public page.
4. Assert the desktop layout carries an explicit 4:1 grid ratio and has a responsive single-column rule.
5. Run `node work/check-villa-page.mjs` and confirm it fails before the implementation changes.

### Task 2: Replace live voting UI with the closed-result page

**Files:**
- Modify: `outputs/taichung-villa-vote.html`

**Steps:**
1. Build a desktop grid with the original content at left and a narrow, sticky payment card at right.
2. Add a prominent “投票已截止” hero and winner card for 大雪星空 Starry Night.
3. Retain the candidate cards and comparison information, marking 大雪星空 as the winner, but remove all selection and submission UI.
4. Add a payment data constant for the approved 11 names, all with `paid: false`, and render a three-column table: 姓名／金額／狀態.
5. Calculate and display the paid-person count and total from that same data constant.
6. Add a responsive rule so narrow screens stack in the order: hero, winner, payment progress, remaining accommodation details.

### Task 3: Verify and publish

**Files:**
- Verify: `work/check-villa-page.mjs`, `outputs/taichung-villa-vote.html`

**Steps:**
1. Run the static test and inspect the working tree diff.
2. Commit only the planned page, test, and plan changes; do not stage the unrelated untracked design files.
3. Push the current branch to GitHub and monitor the Pages workflow.
4. Request the published site and verify the final-result and payment-progress text is publicly served.

