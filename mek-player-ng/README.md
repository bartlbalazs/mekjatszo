# MEK Player Angular

Modern Angular application for browsing and playing audiobooks from MEK (Magyar Elektronikus Könyvtár).

## Features

- Browse books with search, sorting, and pagination
- Browse authors with search and pagination
- View author details with all their books
- Audio player with chapter navigation
- Similar book recommendations
- Mobile-responsive design
- Modern gradient UI theme

## Tech Stack

- Angular 20.3.7
- Angular Material
- TypeScript
- SCSS
- Signals for reactive state management

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later

## Installation

```bash
cd mek-player-ng
npm install
```

## Development

Run the development server:

```bash
npm start
```

Or:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes to the source files.

## Build

Build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Static Data

The application uses static JSON files located in `/public/static/`:

- `full_list.json` - List of all books
- `author_list.json` - List of all authors
- `books/[id].json` - Individual book details
- `authors/[author].json` - Books by specific author

## Deployment

### GitHub Pages

1. Build the application:
   ```bash
   ng build --base-href=/mekjatszo/
   ```

2. Deploy the `dist/` folder to GitHub Pages

### Other Platforms

The application can be deployed to any static hosting service (Netlify, Vercel, etc.) by deploying the contents of the `dist/` directory after building.

## Project Structure

```
src/
├── app/
│   ├── models/          # Data models and interfaces
│   ├── services/        # Services (data, audio)
│   ├── pages/           # Page components
│   │   ├── books/
│   │   ├── authors/
│   │   ├── author-detail/
│   │   └── book-detail/
│   ├── app.component.*  # Root component
│   ├── app.routes.ts    # Routing configuration
│   └── app.config.ts    # Application configuration
└── styles.scss          # Global styles
```

## License

MIT
