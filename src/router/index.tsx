import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { RootLayout } from "@/components/layout/RootLayout";
import { Navigate, createBrowserRouter } from "react-router-dom";
import AboutPage from "@/pages/About";
import CarDetailsStubPage from "@/pages/CarDetailsStub";
import ContactPage from "@/pages/Contact";
import HomePage from "@/pages/Home";
import InventoryPage from "@/pages/Inventory";
import NotFoundPage from "@/pages/NotFound";
import AdminLoginPage from "@/pages/admin/AdminLogin";
import AdminCarsPage from "@/pages/admin/AdminCars";
import AdminCarEditPage from "@/pages/admin/AdminCarEdit";
import AdminCarNewPage from "@/pages/admin/AdminCarNew";
import AdminDashboardPage from "@/pages/admin/AdminDashboard";
import AdminInquiriesPage from "@/pages/admin/AdminInquiries";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/cars", element: <InventoryPage /> },
      { path: "/inventory", element: <Navigate to="/cars" replace /> },
      { path: "/cars/:slug", element: <CarDetailsStubPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
    ]
  },
  { path: "/admin/login", element: <AdminLoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboardPage /> },
          { path: "cars", element: <AdminCarsPage /> },
          { path: "cars/new", element: <AdminCarNewPage /> },
          { path: "cars/:id/edit", element: <AdminCarEditPage /> },
          { path: "inquiries", element: <AdminInquiriesPage /> }
        ]
      }
    ]
  },
  { path: "*", element: <NotFoundPage /> }
]);
