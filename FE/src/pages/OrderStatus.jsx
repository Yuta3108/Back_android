import { useEffect, useState } from "react";
import axios from "axios";
import { FaBox } from "react-icons/fa";

export default function OrderStatus() {
    const [orders, setOrders] = useState([]);
    const [editingOrder, setEditingOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/orders/all"); // <-- sửa lại nếu API này trả về danh sách
            setOrders(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy đơn hàng:", err);
        }
    };

    const handleEdit = (order) => {
        setEditingOrder(order);
        setNewStatus(order.trangthai);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:5000/api/orders/${editingOrder.madonhang}/status`, // <-- CHỖ NÀY SỬA LẠI
                { trangthai: newStatus }
            );
            setEditingOrder(null);
            fetchOrders();
        } catch (err) {
            alert("Lỗi khi cập nhật trạng thái: " + (err.response?.data?.message || err.message));
        }
    };

    const handleCancel = () => {
        setEditingOrder(null);
    };

    return (
        <div className="p-6 bg-[#fdfaf6] min-h-screen text-[#4b2e2e]">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                    <FaBox /> Quản lý Trạng thái Đơn hàng
                </h2>
                <p className="text-[#6e5345] mb-6">
                    Theo dõi và cập nhật trạng thái các đơn hàng.
                </p>
            </div>

            <div className="max-w-6xl mx-auto overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white border text-sm">
                    <thead className="bg-[#a37c5d] text-white">
                        <tr>
                            {[
                                "Mã đơn",
                                "Ngày đặt",
                                "Tổng tiền",
                                "Trạng thái",
                                "Ghi chú",
                                "Thanh toán",
                                "Số lượng",
                                "Khách hàng",
                                "Sản phẩm",
                                "Hành động",
                            ].map((h, i) => (
                                <th key={i} className="px-4 py-2 text-left">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index} className="border-b hover:bg-[#fefaf4] transition">
                                <td className="px-4 py-2">{order.madonhang}</td>
                                <td className="px-4 py-2">
                                    {new Date(order.ngaydat).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2">{order.tongtien.toLocaleString()} đ</td>
                                <td className="px-4 py-2 capitalize">{order.trangthai}</td>
                                <td className="px-4 py-2">{order.ghichu}</td>
                                <td className="px-4 py-2">{order.phuongthucthanhtoan}</td>
                                <td className="px-4 py-2">{order.soluong}</td>
                                <td className="px-4 py-2">{order.ten_khach_hang}</td>
                                <td className="px-4 py-2">{order.ten_san_pham}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleEdit(order)}
                                        className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]"
                                    >
                                        Sửa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingOrder && (
                <div className="mt-8 flex justify-center">
                    <div className="w-full max-w-md mx-auto bg-[#f9f4ef] rounded-xl shadow p-5 border border-[#e1d4c7]">
                        <h3 className="text-base sm:text-lg font-semibold text-center mb-4 text-[#5b3b2e]">
                            🛠️ Sửa trạng thái đơn #{editingOrder.madonhang}
                        </h3>

                        <div className="mb-4 text-left">
                            <label htmlFor="status" className="block text-sm mb-1 text-[#5b3b2e] font-medium">
                                Trạng thái:
                            </label>
                            <select
                                id="status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-[#4b2e2e] focus:outline-none focus:ring-2 focus:ring-[#a37c5d]"
                            >
                                <option value="choxuly">Chờ xử lý</option>
                                <option value="danggiao">Đang giao</option>
                                <option value="dahuy">Đã hủy</option>
                                <option value="dathanhcong">Đã thành công</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                className="bg-gray-200 text-gray-800 px-4 py-2 text-sm rounded hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-[#a37c5d] text-white px-4 py-2 text-sm rounded hover:bg-[#8b644a]"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
