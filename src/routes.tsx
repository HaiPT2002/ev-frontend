import React from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehiclesList from './pages/VehiclesList';
import VehicleDetail from './pages/VehicleDetail';
import ContractsList from './pages/ContractsList';
import ContractDetail from './pages/ContractDetail';
import CustomersList from './pages/CustomersList';
import CustomerDetail from './pages/CustomerDetail';
import TestDrives from './pages/TestDrives';
import TestDriveCreate from './pages/TestDriveCreate';
import UsersList from './pages/UsersList';
import UserEdit from './pages/UserEdit';
import DealersList from './pages/DealersList';
import DealerDetail from './pages/DealerDetail';
import PaymentsCreate from './pages/PaymentsCreate';
import PaymentsList from './pages/PaymentsList';
import PaymentReturn from './pages/PaymentReturn';
import Settings from './pages/Settings';
import PaymentMethods from './pages/PaymentMethods';
import Reports from './pages/Reports';
import DevVnpayDebug from './pages/DevVnpayDebug';
import NotFound from './pages/NotFound';

const routes = [
  { path: 'login', element: <Login /> },

  // Dashboard: authenticated users (admin, staff, dealer)
  {
    path: 'dashboard',
    element: <Dashboard />,
    roles: ['ADMIN', 'EVM_STAFF', 'DEALER_MANAGER', 'DEALER_STAFF'],
  },

  // Vehicles are public (permitAll)
  { path: 'vehicles', element: <VehiclesList /> },
  { path: 'vehicles/:id', element: <VehicleDetail /> },

  // Contracts: protected for staff & dealers
  {
    path: 'contracts',
    element: <ContractsList />,
    roles: ['ADMIN', 'EVM_STAFF', 'DEALER_MANAGER', 'DEALER_STAFF'],
  },
  {
    path: 'contracts/:id',
    element: <ContractDetail />,
    roles: ['ADMIN', 'EVM_STAFF', 'DEALER_MANAGER', 'DEALER_STAFF'],
  },

  // Customers: restrict to staff/dealers
  {
    path: 'customers',
    element: <CustomersList />,
    roles: ['ADMIN', 'EVM_STAFF', 'DEALER_MANAGER', 'DEALER_STAFF'],
  },
  {
    path: 'customers/:phone',
    element: <CustomerDetail />,
    roles: ['ADMIN', 'EVM_STAFF', 'DEALER_MANAGER', 'DEALER_STAFF'],
  },

  // Test drives: dealer-scoped
  { path: 'testdrives', element: <TestDrives />, roles: ['DEALER_MANAGER', 'DEALER_STAFF'] },
  {
    path: 'testdrives/create',
    element: <TestDriveCreate />,
    roles: ['DEALER_MANAGER', 'DEALER_STAFF'],
  },

  // Users: admin only
  { path: 'users', element: <UsersList />, roles: ['ADMIN'] },
  { path: 'users/:id', element: <UserEdit />, roles: ['ADMIN'] },

  // Dealers: admin
  { path: 'dealers', element: <DealersList />, roles: ['ADMIN'] },
  { path: 'dealers/:id', element: <DealerDetail />, roles: ['ADMIN'] },

  // Payments: staff & dealers
  {
    path: 'payments/create',
    element: <PaymentsCreate />,
    roles: ['ADMIN', 'EVM_STAFF', 'DEALER_MANAGER', 'DEALER_STAFF'],
  },
  {
    path: 'payments',
    element: <PaymentsList />,
    roles: ['ADMIN', 'EVM_STAFF', 'DEALER_MANAGER', 'DEALER_STAFF'],
  },
  // Payment return is public (VNPAY redirect)
  { path: 'payments/return', element: <PaymentReturn /> },

  // Settings: admin only
  { path: 'settings', element: <Settings />, roles: ['ADMIN'] },

  { path: 'payment-methods', element: <PaymentMethods />, roles: ['ADMIN'] },
  { path: 'reports', element: <Reports />, roles: ['ADMIN', 'EVM_STAFF'] },
  { path: 'dev/vnpay-debug', element: <DevVnpayDebug />, roles: ['ADMIN'] },

  { path: '*', element: <NotFound /> },
];

export default routes;
