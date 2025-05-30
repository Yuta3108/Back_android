import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
    { to: '/', label: 'Trang chính' },
    { to: '/employees', label: 'Quản lý Nhân viên' },
    { to: '/products', label: 'Quản lý Sản phẩm' },
    { to: '/order-status', label: 'Quản lý Trạng thái Đơn hàng' },
    { to: '/users', label: 'Quản lý Khách hàng' },
    { to: '/combos', label: 'Combo Sản Phẩm' },
    { to: '/table', label: 'Quản lý bàn ' },
];

export default function Sidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Nút toggle mobile */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-[#d4a373] text-white p-2 rounded-md shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {/* Sidebar */}
            <div
                className={`fixed z-40 top-0 left-0 h-full w-64 bg-[#fdf6f0] text-[#4e2d1e] py-10 px-4 border border-[#e6d2b2] shadow-xl 
                transform transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
            >
                <h1 className="text-3xl font-bold mb-10 text-center tracking-wide text-[#4e2d1e]">
                    ☕ Cafe Admin
                </h1>

                <ul className="space-y-2">
                    {menuItems.map(({ to, label }) => {
                        const isActive = location.pathname === to;
                        return (
                            <li key={to}>
                                <Link
                                    to={to}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-base font-medium tracking-wide transition-all duration-200 shadow-sm
                                        ${isActive
                                            ? 'bg-[#d4a373] text-white shadow-md'
                                            : 'hover:bg-[#f0e1cf] hover:text-[#4e2d1e] text-[#7a5c3d]'
                                        }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}
