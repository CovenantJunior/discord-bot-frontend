import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import Account from 'src/pages/Account';
import CustomerList from 'src/pages/CustomerList';
import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import ProductList from 'src/pages/ProductList';
import Register from 'src/pages/Register';
import Settings from 'src/pages/Settings';

import ChannelList from 'src/pages/ChannelList';
import ChartList from './pages/ChartList';
import StripeProductList from './pages/StripeProductList';
import SubscriberList from './pages/SubscriberList'
import TaskList from './pages/TaskList'
import WebhookList from './pages/WebhookList'
import Playground from './pages/Playground';
import StripeLinkUsersList from './pages/StripeLinkUsersList';




const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
      { path: 'settings', element: <Settings /> },
      { path: 'channels', element: <ChannelList /> },
      { path: 'charts', element: <ChartList /> },
      { path: 'stripeproduct', element: <StripeProductList /> },
      { path: 'subscriber', element: <SubscriberList /> },
      { path: 'tasks', element: <TaskList /> },
      { path: 'webhooks', element: <WebhookList /> },
      { path: 'stripelinkedusers', element: <StripeLinkUsersList /> },
      { path: 'playground', element: <Playground /> },
      // { path: 'login', element: <Login /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/app/channels" /> },
      { path: '/login', element: <Login /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
