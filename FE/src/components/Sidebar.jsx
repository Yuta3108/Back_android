// import { Link, useLocation } from 'react-router-dom';

// const menuItems = [
//     { to: '/', label: '🏠 Trang chính' },
//     { to: '/employees', label: '👥 Quản lý Nhân viên' },
//     { to: '/products', label: '🛒 Quản lý Sản phẩm' },
// ];

// export default function Sidebar() {
//     const location = useLocation();

//     return (
//         <div className="w-64 h-screen bg-[#5c3d2e] text-white px-6 py-10 shadow-lg">
//             <h1 className="text-4xl font-extrabold mb-10 text-[#fef3e7] tracking-wide text-center">
//                 Cafe Admin
//             </h1>
//             <ul className="space-y-4 list-none p-0 m-0">
//                 {menuItems.map(({ to, label }) => (
//                     <li key={to}>
//                         <Link
//                             to={to}
//                             className={`block text-lg font-semibold px-4 py-3 rounded-lg transition-all ${location.pathname === to
//                                 ? 'bg-[#a1866f] text-white'
//                                 : 'hover:bg-[#7a5b4a] text-[#f3e9e3]'
//                                 }`}
//                         >
//                             {label}
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
    { to: '/', label: '🏠 Trang chính' },
    { to: '/employees', label: '👥 Quản lý Nhân viên' },
    { to: '/products', label: '🛒 Quản lý Sản phẩm' },
    { to: '/order-status', label: '📦 Quản lý Trạng thái Đơn hàng' },
];

export default function Sidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Nút toggle cho mobile */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-[#5c3d2e] text-white p-2 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {/* Sidebar */}
            <div
                className={`fixed z-40 top-0 left-0 h-full w-64 bg-[#5c3d2e] text-white py-10 shadow-lg transform transition-transform duration-300
  ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
            >
                <h1 className="text-4xl font-extrabold mb-10 text-[#fef3e7] tracking-wide text-center">
                    Cafe Admin
                </h1>
                <ul className="space-y-4 list-none p-0 m-0">
                    {menuItems.map(({ to, label }) => (
                        <li key={to}>
                            <Link
                                to={to}
                                onClick={() => setIsOpen(false)} // auto close khi chọn
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
        </>
    );
}