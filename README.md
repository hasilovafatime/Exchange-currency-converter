# Frontend Mentor - Currency Converter App Solution

This is a solution to the [Currency Converter App challenge on Frontend Mentor](https://www.frontendmentor.io). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
    - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size (Responsive Design).
- See hover and focus states for all interactive elements on the page.
- Convert any amount from one selected currency to another dynamically.
- Swap the "From" and "To" currencies instantly using the transfer/swap button.
- View historical rates on an interactive area chart (with multiple timeframes like 1D, 1W, 1M, etc.).
- Compare the current sending amount across multiple top-tier global currencies simultaneously in the "Compare" tab.
- Add/remove specific currency pairs to/from a persistent "Favorites" list.
- Log conversions manually and manage a detailed transformation history log (with delete capability).
- Keep data persistent across browser sessions using `localStorage`.

### Screenshot

![](./screenshot.png) 
*Drop your final desktop/mobile screenshots or GIFs here to showcase your awesome implementation!*

### Links

- Solution URL: [Add your Frontend Mentor solution URL here](https://your-solution-url.com)
- Live Site URL: [Add your live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- Mobile-first workflow
- **React** (Functional Components & Hooks)
- **Next.js** (App Router & Client-side Rendering)
- **Sass / SCSS** (Custom modern dark-theme design system architecture)
- **Bootstrap 5** (Grid system & utility classes)
- **Recharts** (For rendering the beautiful gradient area-chart metrics)
- **React Icons / FontAwesome 6** (For crisp, scalable iconography)

### What I learned

Throughout this project, I deepened my knowledge of handling complex multi-tab UI states and integrating dynamic third-party data visualization tools within a Next.js environment. 

A key highlight was isolating component inline-styles entirely into a clean, modular SCSS architecture, utilizing variables for a consistent dark-theme look-and-feel:

```scss
// Snippet of the theme control architecture
$bg-panel: #0e0e10;
$bg-card: #161619;
$brand-neon: rgb(208, 241, 67);

.currency {
  background-color: $bg-panel;
  border: 1px solid #222;
  
  .box1 {
    background-color: $bg-card;
    // ... custom transition logic
  }
}art editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
