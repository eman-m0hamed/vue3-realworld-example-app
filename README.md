# ![RealWorld Example App](logo.png)

[![Codecov branch](https://img.shields.io/codecov/c/github/mutoe/vue3-realworld-example-app/master?logo=codecov&style=for-the-badge)](https://app.codecov.io/gh/mutoe/vue3-realworld-example-app/branch/master)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/mutoe/vue3-realworld-example-app/test.yml?logo=github&style=for-the-badge)](https://github.com/mutoe/vue3-realworld-example-app/actions?query=branch%3Amaster)
[![code style](https://img.shields.io/badge/Code_Style-Anthony_Fu-333?style=for-the-badge&logo=eslint)](https://github.com/anthony/eslint-config)

> ### [Vue3](https://v3.vuejs.org/) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

- [Demo](https://vue3-realworld-example-app-mutoe.vercel.app)
- [RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with **Vue3** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Vue3** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

> Enjoy it! 😄


# Upgraded Frontend & Revision Feature

## Setup & Run

### Prerequisites
- Node.js (v16+ recommended)
- pnpm (recommended) or npm/yarn

### Install dependencies
```
pnpm install
# or
npm install
# or
yarn install
```

### Start the development server
```
pnpm dev
# or
npm run dev
# or
yarn dev
```
- The app will be available at `http://localhost:5173` by default.

### Build for production
```
pnpm build
# or
npm run build
# or
yarn build
```

---

## Revision Feature Documentation

### Overview
- The frontend supports article revision history: users can view, inspect, and revert to previous revisions of any article.
- Revision data is fetched from the backend via `/articles/:slug/revisions` and `/articles/:slug/revisions/:id` endpoints.

### How it works
1. **Viewing Revisions**
   - On the article detail page, click the "Show Revisions" button to display a list of all revisions for the article.
   - Each revision entry shows: title, description, author, created date, and tags.
   - Clicking a revision navigates to a dedicated revision details page.

2. **Revision Details Page**
   - Shows the full title, description, body, and tag list for the selected revision.
   - If the user is authenticated, a "Revert to this Revision" button is shown.

3. **Reverting to a Revision**
   - Clicking the revert button sends a request to `/articles/:slug/revisions/:id/revert`.
   - On success, the article is updated to match the selected revision, and the user is redirected to the updated article page.
   - SweetAlert popups provide user feedback for success or error.

### Assumptions & Design Decisions
- **Authentication**: Only authenticated users can revert articles to previous revisions.
- **API Contract**: The backend must support the following endpoints:
  - `GET /articles/:slug/revisions` (list all revisions for an article)
  - `GET /articles/:slug/revisions/:id` (get details for a specific revision)
  - `PUT /articles/:slug/revisions/:id/revert` (revert to a specific revision)
- **UI/UX**:
  - Revision list and details are styled for clarity and usability.
  - Tags and description are left-aligned; tags are displayed inline with their label.
  - All HTTP actions show SweetAlert popups for user feedback.
- **Routing**: The revision details page is accessible at `/article/:slug/revisions/:revisionId`.
- **Slug Handling**: If reverting changes the article's slug, the UI will redirect to the new slug automatically.

---

