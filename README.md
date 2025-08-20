# McMillan Design Planbook

A modern web application for browsing and searching floor plans, built with React, Vite, and Algolia.

## Features

- 🔍 Advanced search functionality powered by Algolia
- 🎨 Modern UI with Chakra UI
- 🔐 Secure authentication with Clerk
- 📱 Responsive design for all devices
- 🚀 Fast performance with Vite
- 🆕 Recently Added indicators for new floor plans

## Recently Added Feature

The application now includes a "recently added" pill that automatically appears on floor plan cards for plans created within the last 30 days. This feature helps users identify newly added content.

### How it works

- **Automatic Detection**: Plans with a `createdAt` field in ISO format (e.g., "2025-04-28T19:21:57.900Z") are automatically checked
- **Smart Display**: The pill shows relative time (e.g., "2 days ago", "1 week ago", "Today")
- **Visual Design**: Green pill positioned on the top-left of the card image
- **30-Day Window**: Only plans created within the last 30 days show the indicator

### Data Requirements

To enable this feature, ensure your floor plan data includes a `createdAt` field:

```json
{
  "objectID": "plan-123",
  "planNumber": "A-1234",
  "description": "Modern 3-bedroom home",
  "bedrooms": 3,
  "bathrooms": 2,
  "squareFeet": 1800,
  "createdAt": "2025-04-28T19:21:57.900Z"
}
```

### Implementation Details

The feature is implemented using:

- **Utility Functions**: `isRecentlyAdded()`, `getTimeAgo()`, `getDaysSince()` in `src/lib/utils.ts`
- **Component Updates**: Enhanced `FloorPlanCard` and `FloorPlanInfo` components
- **Type Safety**: Updated TypeScript interfaces across all components

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
