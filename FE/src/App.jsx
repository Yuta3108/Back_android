import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Products from './pages/Products';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar chiếm chiều rộng cố định */}
        <Sidebar />

        {/* Nội dung chính chiếm phần còn lại, thêm bg và đảm bảo chiều cao */}
        <div className="flex-1 bg-[#fdfaf6]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
