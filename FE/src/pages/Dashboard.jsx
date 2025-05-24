import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [employeeStats, setEmployeeStats] = useState(null);
    const [productStats, setProductStats] = useState(null);
    const [orderStats, setOrderStats] = useState(null);
    const [userStats, setUserStats] = useState(null); // ✅ THÊM DÒNG NÀY
    useEffect(() => {
        //Thống kê nhân viên
        axios.get('http://localhost:5000/api/employees/stats')
            .then(res => setEmployeeStats(res.data.data))
            .catch(err => console.error('Lỗi khi lấy thống kê nhân viên:', err));
        //Thống kê sản phẩm
        axios.get('http://localhost:5000/api/products/stats')
            .then(res => setProductStats(res.data.data))
            .catch(err => console.error('Lỗi khi lấy thống kê sản phẩm:', err));
        //Thống kê đơn hàng
        axios.get('http://localhost:5000/api/orders/stats')
            .then(res => setOrderStats(res.data.data))
            .catch(err => console.error('Lỗi khi lấy thống kê đơn hàng:', err));
        // Thống kê khách hàng
        axios.get('http://localhost:5000/api/users/stats')
            .then(res => setUserStats(res.data)) // Không cần .data.data
            .catch(err => console.error('Lỗi khi lấy thống kê khách hàng:', err));
    }, []);


    return (
        <div className="min-h-screen bg-[#fdfaf6] p-10 text-[#5c3d2e]">
            {/* Tiêu đề trang */}
            <div className="flex flex-col items-center text-center mb-12">
                <h1 className="text-5xl font-bold mb-3 flex items-center gap-4">
                    <span className="text-5xl">☕</span>
                    Cafe Admin
                    <span className="text-3xl text-[#a1866f] font-medium">Thống kê</span>
                </h1>
                <p className="text-lg text-[#6e5345]">Chào mừng đến với hệ thống quản lý quán cà phê!</p>
            </div>

            {/* Nội dung chia 3 cột */}
            <div className="grid grid-cols-3 gap-8">
                {/* Box 1: Nhân viên */}
                <div className="bg-white p-8 rounded-2xl shadow-md border border-[#e9ded6] hover:shadow-lg transition duration-200">
                    <h2 className="text-2xl font-semibold mb-3 flex items-center justify-center gap-3">
                        <span className="text-2xl">👥</span> Nhân viên
                    </h2>
                    {employeeStats ? (
                        <div className="text-[#7b5e57] text-center space-y-1 text-lg">
                            <p>Tổng số: <strong>{employeeStats.total_employees}</strong></p>
                            <p>Tổng lương: <strong>{Number(employeeStats.total_salary).toLocaleString()} đ</strong></p>
                            <p>Lương trung bình: <strong>{Number(employeeStats.average_salary).toLocaleString()} đ</strong></p>
                            <p>Lương cao nhất: <strong>{Number(employeeStats.max_salary).toLocaleString()} đ</strong></p>
                            <p>Lương thấp nhất: <strong>{Number(employeeStats.min_salary).toLocaleString()} đ</strong></p>
                        </div>
                    ) : (
                        <p className="text-[#7b5e57] text-center">Đang tải thống kê...</p>
                    )}
                </div>

                {/* Box 2: Sản phẩm */}
                <div className="bg-white p-8 rounded-2xl shadow-md border border-[#e9ded6] hover:shadow-lg transition duration-200">
                    <h2 className="text-2xl font-semibold mb-3 flex items-center justify-center gap-3">
                        <span className="text-2xl">🛒</span> Sản phẩm
                    </h2>
                    {productStats ? (
                        <div className="text-[#7b5e57] text-center space-y-1 text-lg">
                            <p>Tổng số: <strong>{productStats.total_products}</strong></p>
                            <p>Tổng giá trị: <strong>{Number(productStats.total_price).toLocaleString()} đ</strong></p>
                            <p>Giá trung bình: <strong>{Number(productStats.average_price).toLocaleString()} đ</strong></p>
                            <p>Giá cao nhất: <strong>{Number(productStats.max_price).toLocaleString()} đ</strong></p>
                            <p>Giá thấp nhất: <strong>{Number(productStats.min_price).toLocaleString()} đ</strong></p>
                        </div>
                    ) : (
                        <p className="text-[#7b5e57] text-center text-lg">Đang tải thống kê...</p>
                    )}
                </div>

                {/* Box 3: Đơn hàng */}
                <div className="bg-white p-8 rounded-2xl shadow-md border border-[#e9ded6] hover:shadow-lg transition duration-200">
                    <h2 className="text-2xl font-semibold mb-3 flex items-center justify-center gap-3">
                        <span className="text-2xl">📦</span> Đơn hàng
                    </h2>
                    {orderStats ? (
                        <div className="text-[#7b5e57] text-center space-y-2 text-lg">
                            <p>Tổng đơn hàng: <strong>{orderStats.total_orders}</strong></p>
                            <p>Tổng doanh thu: <strong>{Number(orderStats.total_revenue).toLocaleString()} đ</strong></p>
                            <p>Giá trị đơn trung bình: <strong>{Number(orderStats.average_order_value).toLocaleString()} đ</strong></p>
                            <p>Giá trị đơn lớn nhất: <strong>{Number(orderStats.max_order_value).toLocaleString()} đ</strong></p>
                            <p>Giá trị đơn nhỏ nhất: <strong>{Number(orderStats.min_order_value).toLocaleString()} đ</strong></p>

                            {/* Thống kê theo trạng thái */}
                            <p>Trạng thái:</p>
                            {orderStats.byStatus.map(item => (
                                <p key={item.trangthai} className="ml-2">
                                    <strong>{item.trangthai}: {item.count}</strong>
                                </p>
                            ))}

                            {/* Thống kê theo phương thức thanh toán */}
                            <p className="mt-2">Phương thức thanh toán:</p>
                            {orderStats.byPayment.map(item => (
                                <p key={item.phuongthucthanhtoan} className="ml-2">
                                    <strong>{item.phuongthucthanhtoan}: {item.count}</strong>
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#7b5e57] text-center text-lg">Đang tải thống kê...</p>
                    )}
                </div>
                {/* Box 4: Khách hàng */}
                <div className="bg-white p-8 rounded-2xl shadow-md border border-[#e9ded6] hover:shadow-lg transition duration-200">
                    <h2 className="text-2xl font-semibold mb-3 flex items-center justify-center gap-3">
                        <span className="text-2xl">🙍‍♂️</span> Khách hàng
                    </h2>
                    {userStats ? (
                        <div className="text-[#7b5e57] text-center text-lg">
                            <p>Tổng số khách hàng: <strong>{userStats.total_user}</strong></p>
                        </div>
                    ) : (
                        <p className="text-[#7b5e57] text-center text-lg">Đang tải thống kê...</p>
                    )}
                </div>

            </div>
        </div>
    );
}
