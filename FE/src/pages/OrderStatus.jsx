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
            const res = await axios.get("http://localhost:5000/api/orders/all");
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
                `http://localhost:5000/api/orders/${editingOrder.madonhang}/status`,
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

            <div className="max-w-6xl mx-auto overflow-x-auto rounded-xl shadow border border-[#e5dacd]">
                <table className="min-w-full bg-white border border-[#e5dacd] text-sm">
                    <thead className="bg-[#D2B48C] text-white text-center">
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
                                <th key={i} className="px-4 py-3 border border-[#e5dacd]">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) =>
                            Array.isArray(order.chitiet) &&
                            order.chitiet.map((item, itemIndex) => (
                                <tr key={`${order.madonhang}-${itemIndex}`} className="border-b border-[#eee1d6] hover:bg-[#fcf7f2] transition text-center">
                                    {itemIndex === 0 && (
                                        <>
                                            <td rowSpan={order.chitiet.length} className="px-4 py-3 border border-[#e5dacd]">{order.madonhang}</td>
                                            <td rowSpan={order.chitiet.length} className="px-4 py-3 border border-[#e5dacd]">
                                                {new Date(order.ngaydat).toLocaleDateString()}
                                            </td>
                                            <td rowSpan={order.chitiet.length} className="px-4 py-3 border border-[#e5dacd] ">
                                                {order.tongtien.toLocaleString()} đ
                                            </td>
                                            <td rowSpan={order.chitiet.length} className="px-4 py-3 border border-[#e5dacd] capitalize">{order.trangthai}</td>
                                            <td rowSpan={order.chitiet.length} className="px-4 py-3 border border-[#e5dacd] ">{order.ghichu}</td>
                                            <td rowSpan={order.chitiet.length} className="px-4 py-3 border border-[#e5dacd]">{order.phuongthucthanhtoan}</td>
                                        </>
                                    )}

                                    <td className="px-4 py-3 border border-[#e5dacd]">{item.soluong}</td>
                                    <td className="px-4 py-3 border border-[#e5dacd]">{order.user.name}</td>
                                    <td className="px-4 py-3 border border-[#e5dacd] ">{item.ten_san_pham}</td>

                                    {itemIndex === 0 && (
                                        <td rowSpan={order.chitiet.length} className="px-4 py-3 border border-[#e5dacd]">
                                            <button
                                                onClick={() => handleEdit(order)}
                                                className="bg-[#c2a28b] text-white px-4 py-1 rounded-full text-sm hover:bg-[#a9836b]"
                                            >
                                                Sửa
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {editingOrder && (
                <div className="mt-8 flex justify-center">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#e5dacd] p-6">
                        <h3 className="text-lg font-semibold text-center mb-4 text-[#5b3b2e]">
                            🛠️ Sửa trạng thái đơn #{editingOrder.madonhang}
                        </h3>

                        <div className="mb-4 text-left">
                            <label htmlFor="status" className="block text-sm font-medium text-[#5b3b2e] mb-1">
                                Trạng thái:
                            </label>
                            <select
                                id="status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full border border-[#d8c7b5] rounded-lg px-3 py-2 text-sm text-[#4b2e2e] bg-[#fcf9f5] focus:outline-none focus:ring-2 focus:ring-[#a37c5d]"
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
                                className="px-4 py-2 text-sm text-[#5e3a1e] border border-[#a37c5d] rounded-full bg-white hover:bg-[#f5eadd]"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 text-sm text-white bg-[#a37c5d] rounded-full hover:bg-[#8b644a]"
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
