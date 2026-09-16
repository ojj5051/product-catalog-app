# Product Catalog App

A simple mobile product catalog application built with **React Native, Expo, TypeScript, and Expo Router**.

The app retrieves product data from the DummyJSON API and provides product browsing, search, category filtering, pagination, pull-to-refresh, and product details.

## Features

- Product listing with:
  - Product title
  - Thumbnail
  - Price
  - Rating

- Pagination using `limit` and `skip`
- Product detail screen
- Product detail image slider
- Search with debounce
- Category filtering
- Search + category filtering
- Pull-to-refresh
- Loading state
- Empty state
- Error handling with retry
- Navigation using Expo Router
- Unit/component tests

## Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- Axios
- Jest
- React Native Testing Library
- DummyJSON API

## Project Structure

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── product_home/
│   │   ├── __tests__/
│   │   │   └── index.test.tsx
│   │   └── index.tsx
│   └── product_details/
│       └── [id].tsx
│
├── api/
│   ├── axios.ts
│   └── productApi.ts
│
├── components/
│   ├── __tests__/
│   │   └── ProductList.test.tsx
│   ├── FilterDropdown.tsx
│   ├── Pagination.tsx
│   ├── ProductList.tsx
│   └── SearchBar.tsx
│
└── types/
    └── product.ts
```

### Code Organization

The application separates the UI and data/API responsibilities:

```text
UI / Presentation
        ↓
API / Data Layer
        ↓
DummyJSON API
```

- `app/` — Screens and Expo Router routes
- `components/` — Reusable UI components
- `api/` — Axios configuration and API functions
- `types/` — TypeScript interfaces
- `__tests__/` — Jest tests

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the application

```bash
npx expo start
```

You can then run the application using:

- Expo Go
- Android Emulator
- iOS Simulator

## Architecture Decisions

### UI / Presentation

The `app` and `components` folders contain screens and reusable UI components.

### Data / API

API communication is kept in the `api` folder rather than directly inside UI components. Axios is used as the HTTP client.

### Types

Product-related TypeScript interfaces are kept in the `types` folder so they can be reused across the application.

### Navigation

Expo Router is used for file-based navigation. Selecting a product navigates to its corresponding product details page.

### State Management

React's built-in state management (`useState`, `useEffect`) is used because the application is small and does not require global state management.

## API

The application uses the DummyJSON Products API.

Main endpoints:

```text
GET /products
GET /products/search?q={query}
GET /products/category/{category}
GET /products/{id}
GET /products/categories
```

Pagination uses `limit` and `skip`.

For example:

```text
/products?limit=20&skip=0
/products?limit=20&skip=20
/products?limit=20&skip=40
```

## Search and Category Filtering

The filtering logic follows this approach:

```text
Search entered?
│
├── Yes
│   ├── Search API
│   └── Apply category filter locally if selected
│
└── No
    │
    ├── Category selected → Category API
    │
    └── All → Products API
```

Search endpoint was used because it was more efficient than filtering the results locally, as it reduce the number of products returned from the API. Additionally the search endpoint also support pagination, so we can use the same pagination logic for both search and category filtering.

## Pagination

The UI uses 1-based page numbers.

```text
Page 1 → skip 0
Page 2 → skip 20
Page 3 → skip 40
```

The page size is currently 20 products.

## Product Details

Selecting a product card navigates to:

```text
/product_details/[id]
```

The selected product information is passed to the detail screen through Expo Router parameters.

## Loading and Empty States

The application provides separate UI states for:

- Loading products
- Successful product loading
- No products found
- API errors
- Retry after an API error
- Image loading
- Image loading failure

## Pull-to-Refresh

The product list supports pull-to-refresh.

Refreshing the list requests the first page again:

```text
Page 1
skip = 0
```

## Testing

Tests are written using Jest and React Native Testing Library.

Run tests with:

```bash
npm test
```

or:

```bash
npx jest
```

### Current Test Coverage

The application includes component tests for important user interactions, including product navigation.

The navigation test verifies that pressing a product card calls:

```text
/product_details/[id]
```

with the correct product ID and product data.

Example flow:

```text
Press Product Card
       ↓
TouchableOpacity onPress
       ↓
router.push()
       ↓
Product Details Screen
```

## AI Usage

AI assistance was used during development to help with implementation ideas, code structure, debugging, and reviewing approaches.

### Pagination

AI was used to assist with the pagination implementation, particularly:

- Calculating the `skip` value based on the current page and page size.
- Structuring the pagination flow using the DummyJSON API's `limit` and `skip` parameters.
- Reviewing the page calculation logic.
- Suggesting ways to handle page changes and reload products when the page changes.

The final pagination implementation was reviewed and integrated into the application based on the project's requirements.

Example:

```tsx
const skip = (pageNumber - 1) * LIMIT;

const response = await getProducts(LIMIT, skip);
```

### Image Slider

AI was also used to assist with implementing the product image slider on the product details screen.

The assistance included:

- Suggesting the use of React Native `FlatList` with `horizontal` and `pagingEnabled`.
- Implementing finger/swipe navigation between product images.
- Implementing automatic image switching at a 3-second interval.
- Adding image position indicators.
- Handling the transition from the last image back to the first image.
- Reviewing the interaction between manual swiping and automatic sliding.

The final implementation uses React Native's built-in `FlatList` and does not require an additional carousel library.

Example:

```tsx
<FlatList
  data={images}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
/>
```

The automatic slider uses:

```tsx
const interval = setInterval(() => {
  setCurrentImage((previous) => {
    const nextIndex = (previous + 1) % images.length;

    imageListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });

    return nextIndex;
  });
}, 3000);
```

### AI Contribution

AI was used as a development assistant rather than as a replacement for implementation or testing. Code suggestions were reviewed, adapted to the application's existing architecture, and tested locally before being included.

## Assumptions

- DummyJSON is available and returns data in the expected format.
- Product thumbnails provided by the API are valid image URLs.
- The application uses 20 products per page.
- Search is performed through the DummyJSON search endpoint.
- When both search and category are selected, the search API is used first and the category is filtered locally.

## Incomplete / Future Improvements

The core requirements of the assessment have been implemented.

Potential improvements for a production application include:

- Image loading/error handling
