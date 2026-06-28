<div align="center">

# Tuinue Wasichana Frontend

### *Empowering Girls Through Education*

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7.7.1-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)

[Demo](#) • [Features](#features) • [Installation](#installation) • [Documentation](#project-structure)

---

</div>

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Components Overview](#components-overview)
- [Styling Architecture](#styling-architecture)
- [Available Scripts](#available-scripts)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## About the Project

**Tuinue Wasichana** (Swahili for "Let's Uplift Girls") is a comprehensive web platform designed to break the cycle of poverty through education. The application connects:

- **Donors** who want to make a meaningful impact
- **Charities** working to support girls' education in Kenya
- **Girls** whose lives are transformed through educational opportunities
- **Communities** that benefit from educated, empowered young women

The platform tells powerful stories of transformation, facilitates secure donations, and provides transparent tracking of impact metrics—all wrapped in a modern, accessible, and emotionally engaging user interface.

---

## Features

### **Public Features**
- **Hero Landing Section** - Inspiring visuals with real-time impact statistics
- **Charity Discovery** - Browse and explore verified charitable organizations
- **Success Stories** - Read transformative stories of girls whose lives have been changed
- **Donation Interface** - Intuitive donation flow with multiple payment options
- **About Us** - Mission, vision, and founder story with editorial design
- **Contact Form** - Direct communication channel with the organization
- **FAQ Section** - Comprehensive answers to common questions

### **User Dashboards**
- **Donor Dashboard** - Track donations, view impact, manage profile
- **Charity Dashboard** - Manage campaigns, view donations, update information
- **Profile Management** - Edit personal information and preferences

### **Admin Features**
- **User Management** - Manage donors and charity accounts
- **Charity Approval** - Review and approve new charity applications
- **Analytics Dashboard** - Comprehensive insights and reporting
- **Content Management** - Manage stories, FAQs, and site content

### **Design Features**
- **Responsive Design** - Mobile-first approach for all devices
- **Editorial Aesthetic** - Magazine-style layouts with custom typography
- **Smooth Animations** - Subtle transitions and hover effects
- **Accessibility** - WCAG-compliant color contrast and navigation
- **Performance Optimized** - Fast loading with lazy loading and code splitting

---

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 19.1.0 |
| **Vite** | Build Tool & Dev Server | 7.0.4 |
| **React Router DOM** | Client-side Routing | 7.7.1 |
| **React Icons** | Icon Library | 5.5.0 |
| **PropTypes** | Runtime Type Checking | 15.8.1 |
| **ESLint** | Code Linting | 9.30.1 |
| **CSS3** | Styling (Custom CSS) | - |

---

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tuinue-wasichana.git
   cd tuinue-wasichana/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

### Alternative Package Managers

**Using Yarn:**
```bash
yarn install
yarn dev
```

**Using pnpm:**
```bash
pnpm install
pnpm dev
```

---

## Project Structure

```
client/
├── public/                    # Static assets
│   ├── About3.jpg
│   ├── favicon.svg
│   └── footer-logo.svg
│
├── src/                       # Source code
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Application entry point
│   │
│   ├── Pages/                # Page components
│   │   ├── HomePage.jsx      # Landing page
│   │   ├── Charities.jsx     # Charity listings
│   │   ├── Donations.jsx     # Donation history
│   │   ├── Donate.jsx        # Donation form
│   │   ├── Stories.jsx       # Success stories
│   │   ├── Contact.jsx       # Contact form
│   │   ├── Profile.jsx       # User profile
│   │   ├── ApplyCharity.jsx  # Charity application
│   │   │
│   │   ├── About/            # About page
│   │   │   ├── About.jsx
│   │   │   └── About.css
│   │   │
│   │   ├── Admin/            # Admin section
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminDashboard.css
│   │   │
│   │   └── Dashboards/       # User dashboards
│   │       ├── DonorDashboard.jsx
│   │       ├── DonorDashboard.css
│   │       ├── CharityDashboard.jsx
│   │       └── CharityDashboard.css
│   │
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── Footer.jsx           # Footer component
│   │   ├── HeroSection.jsx      # Hero banner
│   │   ├── ImpactMetrics.jsx    # Statistics display
│   │   ├── CharityCard.jsx      # Charity card
│   │   ├── StoryCard.jsx        # Story card
│   │   ├── ProgramCard.jsx      # Program card
│   │   ├── FAQItem.jsx          # FAQ accordion
│   │   ├── Button.jsx           # Custom button
│   │   ├── ImpactNote.jsx       # Impact highlight
│   │   │
│   │   ├── Dashboard Components
│   │   │   ├── StatsGrid.jsx
│   │   │   ├── RecentActivities.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   ├── AnalyticsPanel.jsx
│   │   │   ├── CharityStats.jsx
│   │   │   ├── DonationList.jsx
│   │   │   └── CharityList.jsx
│   │   │
│   │   └── Admin Components
│   │       ├── UsersTable.jsx
│   │       ├── CharitiesTable.jsx
│   │       ├── DonationsTable.jsx
│   │       ├── CharityFormModal.jsx
│   │       ├── SettingsModal.jsx
│   │       └── CharityTabs.jsx
│   │
│   ├── contexts/             # React Context providers
│   │   └── AuthContext.jsx      # Authentication context
│   │
│   ├── assets/               # Images and media
│   │   ├── images/
│   │   │   ├── image 1.jpg
│   │   │   ├── mpesa.svg
│   │   │   ├── paypal.svg
│   │   │   └── visa.svg
│   │   ├── TN.svg               # Main logo
│   │   ├── TN-white.svg         # White logo variant
│   │   ├── About2.svg
│   │   ├── founder.jpg
│   │   ├── potrait.jpg
│   │   └── child1-6.svg         # Child illustrations
│   │
│   └── styles/               # Global styles (if any)
│
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies and scripts
├── eslint.config.js          # ESLint configuration
├── .gitignore                # Git ignore rules
└── README.md                 # This file

```

---

## Pages & Routes

| Route | Component | Description | Access Level |
|-------|-----------|-------------|--------------|
| `/` | HomePage | Landing page with hero section | Public |
| `/about` | About | Mission, vision, and team | Public |
| `/charities` | Charities | Browse all charities | Public |
| `/donate` | Donate | Make a donation | Public |
| `/donations` | Donations | Donation history | Authenticated |
| `/stories` | Stories | Success stories | Public |
| `/contact` | Contact | Contact form | Public |
| `/profile` | Profile | User profile management | Authenticated |
| `/apply-charity` | ApplyCharity | Apply as charity | Public |
| `/donor-dashboard` | DonorDashboard | Donor control panel | Donor Only |
| `/charity-dashboard` | CharityDashboard | Charity control panel | Charity Only |
| `/admin` | AdminDashboard | Admin control panel | Admin Only |

---

## Components Overview

### **Layout Components**

#### `Navbar.jsx`
Main navigation component with:
- Logo and branding
- Navigation links
- Mobile hamburger menu
- Login/Register buttons
- User profile dropdown

#### `Footer.jsx`
Footer component featuring:
- Quick links
- Social media icons
- Contact information
- Newsletter subscription
- Copyright notice

---

### **Home Page Components**

#### `HeroSection.jsx`
Eye-catching landing section with:
- Inspiring headline and subtext
- Call-to-action buttons
- Background imagery
- Animated elements

#### `ImpactMetrics.jsx`
Real-time statistics display:
- Girls supported
- Total donations
- Active charities
- Communities impacted

---

### **Card Components**

#### `CharityCard.jsx`
Displays charity information:
- Charity name and logo
- Mission statement
- Donation progress bar
- "Learn More" action

#### `StoryCard.jsx`
Success story showcase:
- Girl's photo
- Story excerpt
- "Read More" link
- Emotional design

#### `ProgramCard.jsx`
Program/initiative cards:
- Program title
- Description
- Icon/illustration
- Key features

---

### **Dashboard Components**

#### `StatsGrid.jsx`
Grid of key metrics:
- Total donations
- Active campaigns
- Impact numbers
- Trend indicators

#### `RecentActivities.jsx`
Activity feed showing:
- Recent donations
- New stories
- System notifications
- Timestamps

#### `QuickActions.jsx`
Action buttons for:
- Make donation
- Create campaign
- View reports
- Settings access

#### `AnalyticsPanel.jsx`
Visual analytics with:
- Charts and graphs
- Performance metrics
- Comparative data
- Export options

---

### **Utility Components**

#### `Button.jsx`
Custom button with variants:
- Primary, secondary, outline
- Different sizes
- Loading states
- Icon support

#### `FAQItem.jsx`
Accordion-style FAQ:
- Collapsible questions
- Smooth animations
- Search functionality

#### `ImpactNote.jsx`
Highlighted impact messages:
- Callout boxes
- Important announcements
- Impact highlights

---

## Styling Architecture

### Design System

The application uses a custom CSS design system with:

**CSS Variables (`:root`)**
```css
--editorial-beige: #f5f3f0
--editorial-dark: #2a2a2a
--editorial-accent: #d4c5b9
```

**Typography**
- **Serif:** 'Playfair Display' - Headlines and editorial content
- **Sans-Serif:** 'Inter' - Body text and UI elements
- **Display:** 'Space Grotesk' - Large headings
- **Script:** 'Dancing Script' - Signatures and accents

**Layout Patterns**
- CSS Grid for complex layouts
- Flexbox for component alignment
- Mobile-first responsive design
- Consistent spacing scale

**Component Styling**
Each component has its own CSS file:
- Scoped styles per component
- BEM-like naming conventions
- Consistent class naming patterns

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

### Detailed Script Usage

**Development Mode**
```bash
npm run dev
```
- Starts Vite dev server
- Hot Module Replacement (HMR) enabled
- Opens at `http://localhost:5173`
- Fast refresh on file changes

**Production Build**
```bash
npm run build
```
- Creates optimized production bundle
- Output in `dist/` directory
- Minified and tree-shaken code
- Ready for deployment

**Preview Production Build**
```bash
npm run preview
```
- Serves production build locally
- Test before deployment
- Available at `http://localhost:4173`

**Linting**
```bash
npm run lint
```
- Checks code quality
- Identifies potential issues
- Enforces coding standards
- Auto-fixable issues with `--fix`

---

## Development Guidelines

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use PropTypes for type checking
- Keep components small and focused
- Use meaningful variable names

### Component Creation

```jsx
// Template for new components
import './ComponentName.css';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

export default ComponentName;
```

### Folder Organization

- Group related components together
- Keep CSS files with their components
- Use index files for clean imports
- Separate pages from reusable components

### Best Practices

**DO:**
- Write semantic HTML
- Use CSS variables for theming
- Add PropTypes to components
- Keep components reusable
- Comment complex logic
- Use meaningful commit messages

**DON'T:**
- Inline large CSS blocks
- Create deeply nested components
- Ignore console warnings
- Commit without testing
- Use magic numbers

---

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
Error: Port 5173 is already in use
```
**Solution:** Kill the process or use a different port:
```bash
npm run dev -- --port 3000
```

---

**Module Not Found**
```bash
Error: Cannot find module 'X'
```
**Solution:** Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Image Not Loading**
```bash
404 Error on image path
```
**Solution:** 
- Check image exists in `src/assets/` or `public/`
- Verify import path is correct
- For public assets, use `/` prefix

---

**Blank Page After Build**
```
Production build shows blank page
```
**Solution:**
- Check browser console for errors
- Verify routing configuration
- Check `base` in `vite.config.js`

---

**Styling Not Applied**
```
CSS styles not showing
```
**Solution:**
- Verify CSS file is imported
- Check class name spelling
- Clear browser cache
- Inspect element in DevTools

---

### Getting Help

- Check existing [issues](https://github.com/yourusername/tuinue-wasichana/issues)
- Review [documentation](#)
- Contact the development team
- Join our [community chat](#)

---

## Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tuinue-wasichana.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git commit -m "Add: Amazing new feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Link related issues
   - Wait for review

### Contribution Guidelines

- Follow the code style guide
- Write clear commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass
- Be respectful and constructive

### Commit Message Convention

```
Type: Brief description

Types:
- Add: New feature
- Fix: Bug fix
- Update: Modify existing feature
- Remove: Delete feature/code
- Refactor: Code restructuring
- Docs: Documentation changes
- Style: Formatting changes
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Founder:** Moses Otieno Ochieng
- **Design Inspiration:** Editorial and magazine-style layouts
- **Icons:** React Icons library
- **Community:** All contributors and supporters

---

## Contact

**Tuinue Wasichana**
- Website: [www.tuinuewasichana.org](#)
- Email: info@tuinuewasichana.org
- Twitter: [@TuinueWasichana](#)
- LinkedIn: [Tuinue Wasichana](#)

---

<div align="center">

**Made with Love for Girls' Education in Kenya**

Star us on GitHub — it helps!

[Back to Top](#tuinue-wasichana-frontend)

</div>
