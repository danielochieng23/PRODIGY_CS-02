import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CategoryProvider } from './contexts/CategoryContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdListPage from './pages/ads/AdListPage';
import AdDetailPage from './pages/ads/AdDetailPage';
import CreateAdPage from './pages/ads/CreateAdPage';
import EditAdPage from './pages/ads/EditAdPage';
import ProfilePage from './pages/user/ProfilePage';
import DashboardPage from './pages/user/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CategoryProvider>
          <Router>
            <div className="App">
              <Header />
              <main style={{ minHeight: 'calc(100vh - 140px)' }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/ads" element={<AdListPage />} />
                  <Route path="/ads/:id" element={<AdDetailPage />} />
                  <Route path="/category/:categorySlug" element={<AdListPage />} />
                  <Route path="/city/:cityName" element={<AdListPage />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/create-ad" 
                    element={
                      <ProtectedRoute>
                        <CreateAdPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/edit-ad/:id" 
                    element={
                      <ProtectedRoute>
                        <EditAdPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              
              {/* Toast Notifications */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{
                  fontFamily: 'Montserrat, sans-serif'
                }}
              />
            </div>
          </Router>
        </CategoryProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
