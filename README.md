# Interman Educational Services Website

A premium, modern, and SEO-friendly website for Interman Educational Services, built with React, Vite, and TypeScript. This project features a dynamic content management system powered by Firebase, premium UI utilizing Tailwind CSS and shadcn/ui, and a fully responsive design.

## 🚀 Features

*   **Premium Design:** High-end aesthetic with glassmorphism, smooth animations (Framer Motion), and a sophisticated color palette (Deep Red, Gold, Royal Blue).
*   **Dynamic Content:**
    *   **Services:** Dynamic loading of services from Firebase.
    *   **Courses:** Browse and search courses managed via the database.
    *   **Gallery:** Dynamic image and video gallery.
    *   **Blogs:** Educational blog with social sharing.
    *   **Reviews:** User-submitted reviews and testimonials.
*   **Admin Panel:** Secure area for managing website content (Courses, Blogs, Gallery, etc.).
*   **SEO Optimized:**
    *   Dynamic meta tags (Title, Description, OG tags) using `react-helmet-async`.
    *   Sitemap (`sitemap.xml`) and Robots (`robots.txt`) configured.
    *   Structured data for better search engine visibility.
*   **Responsive:** Fully mobile-responsive layouts.
*   **PWA Support:** Manifest file included for "Add to Home Screen" capability.

## 🛠️ Technology Stack

*   **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Backend / Database:** [Firebase Realtime Database](https://firebase.google.com/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Toasts:** [Sonner](https://sonner.emilkowal.ski/)

## 📂 Project Structure

```
src/
├── assets/         # Static images and resources
├── components/     # Reusable UI components
│   ├── admin/      # Admin-specific components
│   ├── home/       # Homepage sections
│   ├── layout/     # Navbar, Footer, etc.
│   └── ui/         # shadcn/ui primitives
├── contexts/       # React Contexts (Auth, etc.)
├── lib/            # Utilities and Firebase config
├── pages/          # Application routes (Home, About, Services, etc.)
├── index.css       # Global styles and Tailwind directives
└── main.tsx        # Application entry point
```

## 🔧 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Interman.in
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration:**
    Ensure you have your Firebase configuration set up in `src/lib/firebase.ts`.

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## 📦 Build for Production

To create a production build:

```bash
npm run build
```

This will generate a `dist` folder containing the optimized assets ready for deployment.

## 📝 License

This project is proprietary software for Interman Educational Services.
