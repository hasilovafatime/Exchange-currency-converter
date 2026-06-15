# Frontend Mentor - Currency Converter App Solution

This is a complete, real-world solution to the Currency Converter challenge on Frontend Mentor. Built with a modern dark-theme user experience, dynamic state logic, and interactive metrics tracking.

## Overview

### Features

- **Dynamic Conversion:** Real-time calculation between multiple global currencies.
- **Interactive Charting:** Fully responsive area chart with multiple timeframe filters (1D, 1W, 1M, etc.) powered by Recharts.
- **Multi-Currency Compare:** Simultaneous cross-rate comparison across 8 top-tier currency combinations based on the current input.
- **Persistent Storage:** Native `localStorage` integration keeping user data intact across page reloads.
- **Advanced State Management:** Custom dropdown currency pickers, robust error tracking, and animated status toast feedback.

### Screenshot

![](./screenshot.png)

### Links

- Solution URL: [https://github.com/hasilovafatime/Exchange-currency-converter.git](https://github.com/hasilovafatime/Exchange-currency-converter.git)
- Live Site URL: [https://exchange-currency-converter.vercel.app](https://exchange-currency-converter.vercel.app)

## My Process

### Built With

- Next.js (App Router & Hydration Management)
- React (Hooks, Conditional Rendering, Layout Context)
- Sass / SCSS (Modular architecture & global design variables)
- Bootstrap 5 (Flexible responsive layout system)
- Recharts & React Icons

### Key Focus Areas

- **Hydration Syncing:** Resolved Next.js client-side/server-side state mismatch errors using localized lifecycle logic when loading `localStorage` metrics.
- **CSS Architecture:** Refactored entire styling into highly organized SCSS variables and custom utility hooks, successfully removing standard inline wrappers to maximize maintainability.

```scss
// Scalable theme structure example from the project
$bg-panel: #0e0e10;
$bg-card: #161619;
$brand-neon: rgb(208, 241, 67);

.currency {
  background-color: $bg-panel;
  border: 1px solid #222;
}
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
