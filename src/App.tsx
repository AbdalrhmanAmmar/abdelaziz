import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, HashRouter } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import ErrorBoundary from "./components/error/ErrorBoundary";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AllEmployees from "./pages/Employess/AllEmployees";
import AddEmployee from "./pages/Employess/AddEmployee";
import EditEmployee from "./pages/Employess/EditEmployee";
import EmployeeProfile from "./pages/Employess/EmployeeProfile";
import Allproducts from "./pages/Products/AllProducts";
import AddProduct from "./pages/Products/AddProduct";
import AllWarehouses from "./pages/Warehouse/AllWarehouses";
import AllCategories from "./pages/Category/AllCategories";
import AllBranches from "./pages/Bransches/AllBranches";
import BranchLogin from "./pages/Bransches/BranchLogin";
import BranchDashboard from "./pages/Bransches/BranchDashboard";
import AllOrders from "./pages/Orders/AllOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            {/* Public */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Branch public routes (no auth required) */}
            <Route path="/branch/:slug" element={<BranchLogin />} />
            <Route path="/branch/:slug/dashboard" element={<BranchDashboard />} />

            {/* Protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />

            {/* Employees */}

            <Route
              path="/employees/add"
              element={
                <ProtectedRoute>
                  <AddEmployee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/edit/:id"
              element={
                <ProtectedRoute>
                  <EditEmployee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <EmployeeProfile />
                </ProtectedRoute>
              }
            />

            {/* Warehouses */}
            <Route
              path="/warehouses"
              element={
                <ProtectedRoute>
                  <AllWarehouses />
                </ProtectedRoute>
              }
            />

            {/* Categories */}
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <AllCategories />
                </ProtectedRoute>
              }
            />

            {/* Branches (admin management) */}
            <Route
              path="/branches"
              element={
                <ProtectedRoute>
                  <AllBranches />
                </ProtectedRoute>
              }
            />

            {/* Orders (admin review) */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <AllOrders />
                </ProtectedRoute>
              }
            />

            {/* Products */}
            <Route
              path="/Allproducts"
              element={
                <ProtectedRoute>
                  <Allproducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/add"
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
