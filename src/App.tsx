
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist";
import Friends from "./pages/Friends";
import Reserved from "./pages/Reserved";
import Account from "./pages/Account";
import PublicWishlist from "./pages/PublicWishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <WishlistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/wishlist/:userId" element={<PublicWishlist />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/friends" element={<Friends />} />
                        <Route path="/reserved" element={<Reserved />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </BrowserRouter>
        </WishlistProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
