# Resume Builder Frontend

[![Tests and Build](https://github.com/aafre/resume-builder/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/aafre/resume-builder/actions/workflows/pr-validation.yml)
[![License](https://img.shields.io/github/license/aafre/resume-builder.svg)](../LICENSE)

React + TypeScript + Vite frontend for the Professional Resume Builder.

## 🚀 Live Application
**[Start Building Your Resume →](https://easyfreeresume.com)**

## About This Frontend

This is the React-based user interface for the Resume Builder application. It provides:

- **Visual Resume Editor** - No YAML editing required
- **Real-time Preview** - See changes as you type
- **Template Selection** - Choose from professional designs
- **Auto-save** - Work saved locally in your browser
- **Privacy-focused** - No account required, data stays local

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Vitest** for testing
- **ESLint** for code quality

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone https://github.com/aafre/resume-builder.git
cd resume-builder/resume-builder-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run coverage     # Generate test coverage report
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── components/          # React components
│   ├── blog/           # Blog-related components
│   └── ...
├── contexts/           # React contexts (Editor state)
├── services/           # API services and utilities
├── utils/              # Helper functions
├── types.ts            # TypeScript type definitions
├── styles.css          # Global styles
└── main.tsx           # Application entry point
```

## Key Features

### Code Splitting & Performance
- Lazy loading for non-critical routes
- Optimized bundle sizes
- Resource preloading for critical assets

### State Management
- Context API for editor state
- Local storage for data persistence
- Auto-save functionality

### Testing
- Component tests with Vitest + Testing Library
- Coverage reporting
- CI/CD integration

## Backend Integration

This frontend connects to the Flask backend API for:
- Template data retrieval
- PDF generation
- Icon upload handling

Backend API runs on `http://localhost:5000` in development.

## Building for Production

```bash
npm run build
```

Outputs optimized bundle to `dist/` directory with:
- Code splitting
- Asset optimization
- Gzip compression ready

## Contributing

See the [main project README](../README.md) for contribution guidelines.

## License

MIT License - see [LICENSE](../LICENSE) file for details.

---

Part of the [Professional Resume Builder](../README.md) project.