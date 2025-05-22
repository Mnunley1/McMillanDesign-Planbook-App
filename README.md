# McMillan Design Planbook

A modern web application for browsing and searching floor plans, built with React, Vite, and Algolia.

## Features

- 🔍 Advanced search functionality powered by Algolia
- 🎨 Modern UI with Chakra UI
- 🔐 Secure authentication with Clerk
- 📱 Responsive design for all devices
- 🚀 Fast performance with Vite

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mcmillan-design-planbook.git
cd mcmillan-design-planbook
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```env
VITE_ALGOLIA_APP_ID=your_algolia_app_id
VITE_ALGOLIA_SEARCH_API_KEY=your_algolia_search_api_key
VITE_ALGOLIA_INDEX_NAME=your_algolia_index_name
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Page components
├── styles/        # Global styles
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── App.tsx        # Main application component
```

## Technologies Used

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Algolia](https://www.algolia.com/)
- [Clerk](https://clerk.dev/)
- [React Router](https://reactrouter.com/)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
