# Issue Tracker Mini App

A modern, accessible, and extensible Issue Tracker built with Next.js (App Router) and Tailwind CSS.

## Features

- **Issue List**: Search, filter, and sort issues with live updates and URL sync.
- **Detail Slide-Over**: Edit issues in a right-side drawer with optimistic updates and persistence.
- **New Issue Modal**: (Planned) Create new issues with validation and unique ID generation.
- **Persistence**: All edits and creations are stored in `localStorage` and merged with server data on load.
- **Keyboard Navigation**: (Planned) Navigate and interact with the list using keyboard shortcuts.
- **Accessibility**: Focus management, ARIA labels, and responsive design.

## Setup

### 1. Clone the repository

```sh
git clone https://github.com/Abula28/tracker-mini-app
cd tracker-mini-app
```

### 2. Install dependencies

```sh
npm install
```

### 3. Development

```sh
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```sh
npm run build
npm start
```

## Data Source

- Issues are initially parsed from `public/issues.dat` on the server.
- All user edits and new issues are stored in `localStorage` under the key `tracker-issues-edits`.
- On load, local changes are merged with the server data.

## Architecture Notes

- **App Router**: Uses Next.js App Router for modern routing and layouts.
- **Tailwind CSS**: For rapid, utility-first styling.
- **Reusable Components**: Modal and Drawer are fully accessible and reusable.
- **State Management**: Uses React state and hooks; URL state is synced for search/filter/sort.

## Extensibility

- Add authentication, comments, or more fields as needed.
- Easily extend keyboard shortcuts and accessibility features.
- API routes or server actions can be added for real backend persistence.

## Unfinished/Planned

- Create new issue functionality (adding new issues) is not yet complete.
- Full keyboard navigation and shortcuts.
- More robust error handling and validation.
- Tests and CI setup.

---

**MIT License**
