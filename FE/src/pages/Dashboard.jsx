import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [employeeStats, setEmployeeStats] = useState(null);
    const [productStats, setProductStats] = useState(null);
    const [orderStats, setOrderStats] = useState(null);
    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/employees/stats')
            .then(res => setEmployeeStats(res.data.data))
            .catch(err => console.error('Lỗi khi lấy thống kê nhân viên:', err));

        axios.get('http://localhost:5000/api/products/stats')
            .then(res => setProductStats(res.data.data))
            .catch(err => console.error('Lỗi khi lấy thống kê sản phẩm:', err));

        axios.get('http://localhost:5000/api/orders/stats')
            .then(res => setOrderStats(res.data.data))
            .catch(err => console.error('Lỗi khi lấy thống kê đơn hàng:', err));

        axios.get('http://localhost:5000/api/users/stats')
            .then(res => setUserStats(res.data))
            .catch(err => console.error('Lỗi khi lấy thống kê khách hàng:', err));
    }, []);

    return (
        <div className="min-h-screen bg-[#fefae0] p-10 text-[#4e342e] font-sans">
            {/* Tiêu đề trang */}
            <div className="flex flex-col items-center text-center mb-12">
                <h1 className="text-5xl font-bold mb-3 flex items-center gap-4 text-[#4e342e]">
                    <span className="text-5xl">☕</span>
                    Cafe Admin
                    <span className="text-3xl text-[#d4a373] font-medium">Thống kê</span>
                </h1>
                <p className="text-lg text-[#8d6e63]">Chào mừng đến với hệ thống quản lý quán cà phê!</p>
            </div>

            {/* Nội dung chia 3 cột */}
            <div className="grid grid-cols-3 gap-8">
                {/* Box: Nhân viên */}
                <div className="bg-[#D2B48C] p-8 rounded-2xl shadow-md border border-[#faedcd] hover:shadow-lg hover:scale-[1.02] transition duration-200">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-3 text-[#bc6c25]">
                        <span className="text-2xl">👥</span> Nhân viên
                    </h2>
                    {employeeStats ? (
                        <div className="text-[#5d4037] text-center space-y-2 text-lg">
                            <p>Tổng số: <strong>{employeeStats.total_employees}</strong></p>
                            <p>Tổng lương: <strong>{Number(employeeStats.total_salary).toLocaleString()} đ</strong></p>
                            <p>Lương trung bình: <strong>{Number(employeeStats.average_salary).toLocaleString()} đ</strong></p>
                            <p>Lương cao nhất: <strong>{Number(employeeStats.max_salary).toLocaleString()} đ</strong></p>
                            <p>Lương thấp nhất: <strong>{Number(employeeStats.min_salary).toLocaleString()} đ</strong></p>
                        </div>
                    ) : (
                        <p className="text-[#a1887f] text-center">Đang tải thống kê...</p>
                    )}
                </div>

                {/* Box: Sản phẩm */}
                <div className="bg-[#D2B48C] p-8 rounded-2xl shadow-md border border-[#faedcd] hover:shadow-lg hover:scale-[1.02] transition duration-200">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-3 text-[#6d4c41]">
                        <span className="text-2xl">🛒</span> Sản phẩm
                    </h2>
                    {productStats ? (
                        <div className="text-[#5d4037] text-center space-y-2 text-lg">
                            <p>Tổng số: <strong>{productStats.total_products}</strong></p>
                            <p>Tổng giá trị: <strong>{Number(productStats.total_price).toLocaleString()} đ</strong></p>
                            <p>Giá trung bình: <strong>{Number(productStats.average_price).toLocaleString()} đ</strong></p>
                            <p>Giá cao nhất: <strong>{Number(productStats.max_price).toLocaleString()} đ</strong></p>
                            <p>Giá thấp nhất: <strong>{Number(productStats.min_price).toLocaleString()} đ</strong></p>
                        </div>
                    ) : (
                        <p className="text-[#a1887f] text-center text-lg">Đang tải thống kê...</p>
                    )}
                </div>

                {/* Box: Đơn hàng */}
                <div className="bg-[#D2B48C] p-8 rounded-2xl shadow-md border border-[#faedcd] hover:shadow-lg hover:scale-[1.02] transition duration-200">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-3 text-[#6a994e]">
                        <span className="text-2xl">📦</span> Đơn hàng
                    </h2>
                    {orderStats ? (
                        <div className="text-[#5d4037] text-center space-y-2 text-lg">
                            <p>Tổng đơn hàng: <strong>{orderStats.total_orders}</strong></p>
                            <p>Tổng doanh thu: <strong>{Number(orderStats.total_revenue).toLocaleString()} đ</strong></p>
                            <p>Đơn trung bình: <strong>{Number(orderStats.average_order_value).toLocaleString()} đ</strong></p>
                            <p>Đơn cao nhất: <strong>{Number(orderStats.max_order_value).toLocaleString()} đ</strong></p>
                            <p>Đơn thấp nhất: <strong>{Number(orderStats.min_order_value).toLocaleString()} đ</strong></p>

                            <p className="pt-2">Trạng thái:</p>
                            {orderStats.byStatus.map(item => (
                                <p key={item.trangthai} className="ml-2 text-sm">
                                    <strong>{item.trangthai}: {item.count}</strong>
                                </p>
                            ))}

                            <p className="pt-2">Phương thức thanh toán:</p>
                            {orderStats.byPayment.map(item => (
                                <p key={item.phuongthucthanhtoan} className="ml-2 text-sm">
                                    <strong>{item.phuongthucthanhtoan}: {item.count}</strong>
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#a1887f] text-center text-lg">Đang tải thống kê...</p>
                    )}
                </div>

                {/* Box: Khách hàng */}
                <div className="bg-[#fefae0] p-8 rounded-2xl shadow-md border border-[#5d4037] hover:shadow-lg hover:scale-[1.02] transition duration-200 col-span-3 md:col-span-1">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-3 text-[#c97b63]">
                        <span className="text-2xl">🙍‍♂️</span> Khách hàng
                    </h2>
                    {userStats ? (
                        <div className="text-[#5d4037] text-center text-lg">
                            <p>Tổng số khách hàng: <strong>{userStats.total_user}</strong></p>
                        </div>
                    ) : (
                        <p className="text-[#a1887f] text-center text-lg">Đang tải thống kê...</p>
                    )}
                </div>
            </div>
        </div>

    );
}
