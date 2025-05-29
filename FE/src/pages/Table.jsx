import { useEffect, useState } from "react";
import axios from "axios";

const Table = () => {
    const [tables, setTables] = useState([]);
    const [editingTable, setEditingTable] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newGhiChu, setNewGhiChu] = useState("");

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/tables-with-orders");
            setTables(res.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bàn:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá bàn này?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/tables/${id}`);
            fetchTables();
        } catch (error) {
            console.error("Lỗi khi xoá bàn:", error);
        }
    };

    const handleEdit = (table) => {
        setEditingTable(table);
        setNewGhiChu(table.ghichu || ""); // Nếu ghi chú null
        setShowModal(true);
    };

    const handleUpdateGhiChu = async () => {
        try {
            await axios.put(`http://localhost:5000/api/ghichu/${editingTable.maban}`, {
                ghichu: newGhiChu,
            });
            setShowModal(false);
            fetchTables();
        } catch (error) {
            console.error("Lỗi khi cập nhật ghi chú:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-[#442c2e] mb-2">
                🍽️ Quản lý Bàn ăn
            </h1>
            <p className="text-center text-[#442c2e] mb-4">
                Theo dõi và quản lý bàn trong hệ thống.
            </p>

            <table className="w-full border border-[#c69c6d]">
                <thead>
                    <tr className="bg-[#c69c6d] text-white">
                        <th className="border px-4 py-2">Mã bàn</th> {/* 👈 Thêm dòng này */}
                        <th className="border px-4 py-2">Tên bàn</th>
                        <th className="border px-4 py-2">Ghi chú</th>
                        <th className="border px-4 py-2">Ngày đặt</th>
                        <th className="border px-4 py-2">Tổng tiền</th>
                        <th className="border px-4 py-2">Phương thức TT</th>
                        <th className="border px-4 py-2">Tên KH</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {tables.map((table) => (
                        <tr key={table.maban} className="bg-[#fffaf2] text-center">
                            <td className="border px-2 py-2">{table.maban}</td>
                            <td className="border px-2 py-2">{table.tenban}</td>
                            <td className="border px-2 py-2">{table.ghichu}</td>
                            <td className="border px-2 py-2">{table.ngaydat}</td>
                            <td className="border px-2 py-2">{table.tongtien}đ</td>
                            <td className="border px-2 py-2">{table.phuongthucthanhtoan}</td>
                            <td className="border px-2 py-2">{table.tenkhach}</td>
                            <td className="border px-2 py-2 space-x-2">
                                <button
                                    onClick={() => handleEdit(table)}
                                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(table.maban)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Xoá
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Sửa ghi chú bàn</h2>
                        <textarea
                            className="w-full border p-2 rounded"
                            rows={4}
                            value={newGhiChu}
                            onChange={(e) => setNewGhiChu(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateGhiChu}
                                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
