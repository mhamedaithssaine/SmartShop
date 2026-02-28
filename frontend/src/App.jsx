import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './state/AuthContext.jsx';
import { Layout } from './components/layout/Layout.jsx';
import { Login } from './pages/Login.jsx';
import { ProductList } from './pages/products/ProductList.jsx';
import { ProductNew } from './pages/products/ProductNew.jsx';
import { ProductEdit } from './pages/products/ProductEdit.jsx';
import { ClientList } from './pages/clients/ClientList.jsx';
import { ClientNew } from './pages/clients/ClientNew.jsx';
import { ClientDetail } from './pages/clients/ClientDetail.jsx';
import { ClientEdit } from './pages/clients/ClientEdit.jsx';
import { OrderList } from './pages/orders/OrderList.jsx';
import { OrderNew } from './pages/orders/OrderNew.jsx';
import { OrderDetail } from './pages/orders/OrderDetail.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      </div>
    );
  }
  if (!isAdmin) return <Navigate to="/orders" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/products" replace />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<AdminRoute><ProductNew /></AdminRoute>} />
          <Route path="products/:id/edit" element={<AdminRoute><ProductEdit /></AdminRoute>} />
          <Route path="clients" element={<AdminRoute><ClientList /></AdminRoute>} />
          <Route path="clients/new" element={<AdminRoute><ClientNew /></AdminRoute>} />
          <Route path="clients/:id" element={<AdminRoute><ClientDetail /></AdminRoute>} />
          <Route path="clients/:id/edit" element={<AdminRoute><ClientEdit /></AdminRoute>} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/new" element={<AdminRoute><OrderNew /></AdminRoute>} />
          <Route path="orders/:id" element={<OrderDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
