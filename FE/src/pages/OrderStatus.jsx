import { FaBox } from "react-icons/fa"; // ✅ sửa lỗi FaBox not defined

export default function OrderStatus() {
    return (
        <div className="p-6 bg-[#fdfaf6] min-h-screen text-[#4b2e2e] flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaBox /> Quản lý Trạng thái Đơn hàng
            </h2>
            <p className="text-[#6e5345] mb-8">
                Theo dõi và cập nhật trạng thái các đơn hàng.
            </p>

            {/* Hiển thị bảng giả giống như danh sách nhân viên trong ảnh */}
            <table className="min-w-full table-auto border border-[#fff8f2]">
                <thead className="bg-[#a37c5d] text-white">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Khách hàng</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Trạng thái</th>
                        <th className="px-4 py-2">Tổng tiền</th>
                        <th className="px-4 py-2">Ngày đặt</th>
                        <th className="px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody className="text-left">
                    <tr className="border-t">
                        <td className="px-4 py-2">1</td>
                        <td className="px-4 py-2">Nguyễn Văn A</td>
                        <td className="px-4 py-2">a.nguyen@example.com</td>
                        <td className="px-4 py-2">Đang xử lý</td>
                        <td className="px-4 py-2">500.000 đ</td>
                        <td className="px-4 py-2">09:30 5/5/2025</td>
                        <td className="px-4 py-2">
                            <button className="text-blue-600 hover:underline mr-2">Sửa</button>
                            <button className="text-red-600 hover:underline">Xóa</button>
                        </td>
                    </tr>
                    {/* Thêm các dòng giả nếu cần */}
                </tbody>
            </table>
        </div>
    );
}
