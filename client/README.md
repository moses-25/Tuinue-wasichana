# Tuinue Wasichana Frontend

## Overview

Tuinue Wasichana is a web application designed to empower girls through education by connecting donors, charities, and communities. This frontend is built with React and styled using CSS modules. The application features a modern UI with sections for donations, stories, charity management, and more.

## Features

- **Hero Section:** Inspiring landing section with a call to action and impact statistics.
- **Charity Listings:** Browse and view supported charities.
- **Donations:** Interface for making donations (UI only; backend integration may be incomplete).
- **Success Stories:** Read stories of positively impacted girls.
- **Admin Dashboard:** Manage charities, users, and view analytics (UI only).
- **Authentication:** Login and registration forms (UI only).
- **FAQ & Impact Notes:** Informational sections to guide users and highlight impact.

## Project Structure

```
src/
  ├── App.jsx                # Main application entry
  ├── components/            # Reusable UI components (Navbar, Footer, HeroSection, etc.)
  ├── Pages/                 # Main pages (HomePage, Charities, Donations, Stories, etc.)
  ├── features/auth/         # Authentication-related components and styles
  ├── assets/images/         # Static images and icons
  └── ...                    # Other supporting files
```

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use).

## Notes

- **Backend Integration:** Some features (like donations, authentication, and admin actions) are UI-only and may not fetch or persist data without a working backend.
- **Assets:** All images used in the UI are located in `src/assets/images/`. If you see missing images, ensure the referenced files exist in this directory.
- **Branch Parity:** The current frontend matches the "moses" branch for all major UI components and styles.

## Main UI Components

- **Navbar & Footer:** Consistent navigation and footer across all pages.
- **HeroSection:** Main landing section with a motivational message and statistics.
- **CharityCard, StoryCard, ProgramCard:** Cards for displaying charities, stories, and programs.
- **Admin Dashboard:** UI for managing users, charities, and viewing analytics (requires backend for full functionality).
- **FAQItem, ImpactNote:** Informational and highlight sections.

## Troubleshooting

- If you encounter missing file errors, check the import paths and ensure all referenced files exist.
- For styling issues, verify that all CSS files are present in their respective component folders.
- If the backend is not running or not implemented, some actions will not persist or fetch data.

## Contributing

1. Fork the repository or create a new branch for your feature/fix.
2. Make your changes and ensure the app runs without errors.
3. Submit a pull request or merge your branch after review.

---

This README provides a clear overview and usage guide for your current frontend application, focusing on what is implemented and available.
