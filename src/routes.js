import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import ProductsPageV2 from './pages/ProductsPageV2';
import UsersPageV2 from './pages/UserPageV2';
import Brand from './pages/Brand';
import { getAuthToken } from './services/request/request-service';
import ProductsType from './pages/ProductType';

// ----------------------------------------------------------------------

export default function Router() {
  const [token, setToken] = useState('')
  const navigate = useNavigate();

  const getToken = async () => {
    const getTK = await getAuthToken()
    if (getTK) {
      setToken(getTK.accessToken)
    }
  }

  useEffect(() => {
    getToken()
  }, [])

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token])

  const routes = useRoutes(
    [{
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'productsV2', element: <ProductsPageV2 /> },
        { path: 'userV2', element: <UsersPageV2 /> },
        { path: 'brand', element: <Brand /> },
        { path: 'productType', element: <ProductsType /> },
        { path: 'user', element: <UserPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    ]);

  return routes;
}
