import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Services from "./pages/Services";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import Gallery from "./pages/Gallery";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import PageLoader from "./components/PageLoader";
import ScrollToTopButton from "./components/ScrollToTop";
import ScrollRestoration from "./components/layout/ScrollRestoration";
import ChatBot from "./components/chat/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageLoader>
              <ScrollRestoration />
              <ScrollToTopButton />
              <ChatBot />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/services" element={<Services />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blogs />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/gallery" element={<Gallery />} />

                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageLoader>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
