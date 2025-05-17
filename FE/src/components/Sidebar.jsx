import { Link, useLocation } from 'react-router-dom';

const menuItems = [
    { to: '/', label: '🏠 Trang chính' },
    { to: '/employees', label: '👥 Quản lý Nhân viên' },
    { to: '/products', label: '🛒 Quản lý Sản phẩm' },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-64 h-screen bg-[#5c3d2e] text-white px-6 py-10 shadow-lg">
            <h1 className="text-4xl font-extrabold mb-10 text-[#fef3e7] tracking-wide text-center">
                Cafe Admin
            </h1>
            <ul className="space-y-4 list-none p-0 m-0">
                {menuItems.map(({ to, label }) => (
                    <li key={to}>
                        <Link
                            to={to}
                            className={`block text-lg font-semibold px-4 py-3 rounded-lg transition-all ${location.pathname === to
                                    ? 'bg-[#a1866f] text-white'
                                    : 'hover:bg-[#7a5b4a] text-[#f3e9e3]'
                                }`}
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
