

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Products from './pages/Products';
import OrderStatus from './pages/OrderStatus';
import Users from './pages/Users';
import ComboManager from './pages/ComboProducts';
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 bg-[#fdfaf6] p-4 md:ml-64 transition-all box-border">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/products" element={<Products />} />
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="/users" element={<Users />} />
            <Route path='/combos' element={<ComboManager />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

