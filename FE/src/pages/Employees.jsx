import { useEffect, useState } from "react";
import axios from "axios";

export default function Employees() {
    const [editingEmployee, setEditingEmployee] = useState(null); // Nhân viên đang sửa
    const [showEditForm, setShowEditForm] = useState(false); // Hiện form sửa
    const [employees, setEmployees] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        email: "",
        position: "",
        salary: ""
    });

    useEffect(() => {
        axios.get("http://localhost:5000/api/employees")
            .then((res) => {
                setEmployees(res.data.data || []);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy danh sách nhân viên:", err);
            });
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Anh có chắc muốn xoá nhân viên này không?");
        if (!confirm) return;

        try {
            await axios.delete(`http://localhost:5000/api/employees/${id}`);
            setEmployees((prev) => prev.filter((e) => e.id !== id));
            alert(" Xoá nhân viên thành công");
        } catch (err) {
            console.error("Lỗi khi xoá nhân viên:", err);
            alert(" Lỗi khi xoá nhân viên");
        }
    };

    const handleSubmitEditEmployee = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/employees/${editingEmployee.id}`, editingEmployee);
            setEmployees((prev) =>
                prev.map((e) => (e.id === editingEmployee.id ? editingEmployee : e))
            );
            alert("Cập nhật nhân viên thành công");
            setShowEditForm(false);
            setEditingEmployee(null);
        } catch (err) {
            console.error("Lỗi khi cập nhật:", err);
            if (err.response?.status === 409) {
                alert("Email đã tồn tại");
            } else {
                alert("Lỗi khi cập nhật nhân viên");
            }
        }
    };

    const handleAdd = () => {
        setShowAddForm(true);
    };

    const handleSubmitNewEmployee = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/employees", newEmployee);
            const addedId = res.data.id;

            const added = {
                ...newEmployee,
                id: addedId,
                created_at: new Date().toISOString()
            };

            setEmployees((prev) => [...prev, added]);
            alert(" Thêm nhân viên thành công");

            // Reset form
            setNewEmployee({ name: "", email: "", position: "", salary: "" });
            setShowAddForm(false);
        } catch (err) {
            console.error("Lỗi khi thêm nhân viên:", err);
            if (err.response?.status === 409) {
                alert(" Email đã tồn tại");
            } else {
                alert(" Lỗi khi thêm nhân viên");
            }
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const handleEdit = (id) => {
        const employee = employees.find((e) => e.id === id);
        if (employee) {
            setEditingEmployee(employee);
            setShowEditForm(true);
        }
    };

    return (
        <div className="p-6 bg-[#fdfaf6] min-h-screen text-[#4b2e2e]">
            <h2 className="text-3xl font-bold text-center mb-6">
                👥 Quản lý Nhân viên
            </h2>

            {/* Nút thêm nhân viên */}
            <div className="flex justify-center mb-4">
                <button
                    onClick={handleAdd}
                    className="bg-[#7a5b4a] hover:bg-[#5d4034] text-[#fdfaf6] font-medium py-2 px-4 rounded-lg transition"
                >
                    ➕ Thêm nhân viên
                </button>
            </div>

            {/* Form thêm nhân viên */}
            {showAddForm && (
                <div className="max-w-md mx-auto bg-[#fff8f2] border border-[#e0cfc2] rounded-2xl shadow-md p-6 mb-8 text-[#4b2e2e]">
                    <h3 className="text-lg font-semibold text-center mb-4 flex items-center justify-center gap-2">
                        📝 Thêm nhân viên
                    </h3>
                    <form onSubmit={handleSubmitNewEmployee} className="space-y-3">
                        <div>
                            <label className="block text-sm mb-1">👤 Họ tên</label>
                            <input
                                type="text"
                                name="name"
                                value={newEmployee.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#d2b9a3] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b18c7c]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">📧 Email</label>
                            <input
                                type="email"
                                name="email"
                                value={newEmployee.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#d2b9a3] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b18c7c]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">🏷️ Chức vụ</label>
                            <input
                                type="text"
                                name="position"
                                value={newEmployee.position}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#d2b9a3] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b18c7c]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">💰 Lương</label>
                            <input
                                type="number"
                                name="salary"
                                value={newEmployee.salary}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#d2b9a3] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b18c7c]"
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                            <button
                                type="submit"
                                className="text-[#5d4034] text-sm hover:underline"
                            >
                                ✔️ Thêm
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="text-[#5d4034] text-sm hover:underline"
                            >
                                ✖️ Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {/* Form sửa nhân viên */}
            {showEditForm && editingEmployee && (
                <div className="max-w-md mx-auto bg-[#fff8f2] border border-[#e0cfc2] rounded-2xl shadow-md p-6 mb-8 text-[#4b2e2e]">
                    <h3 className="text-lg font-semibold text-center mb-4 flex items-center justify-center gap-2">
                        🛠️ Sửa nhân viên
                    </h3>
                    <form onSubmit={handleSubmitEditEmployee} className="space-y-3">
                        <div>
                            <label className="block text-sm mb-1">👤 Họ tên</label>
                            <input
                                type="text"
                                name="name"
                                value={editingEmployee.name}
                                onChange={(e) => setEditingEmployee((prev) => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-[#d2b9a3] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b18c7c]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">📧 Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editingEmployee.email}
                                onChange={(e) => setEditingEmployee((prev) => ({ ...prev, email: e.target.value }))}
                                className="w-full px-3 py-2 border border-[#d2b9a3] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b18c7c]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">🏷️ Chức vụ</label>
                            <input
                                type="text"
                                name="position"
                                value={editingEmployee.position}
                                onChange={(e) => setEditingEmployee((prev) => ({ ...prev, position: e.target.value }))}
                                className="w-full px-3 py-2 border border-[#d2b9a3] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b18c7c]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">💰 Lương</label>
                            <input
                                type="number"
                                name="salary"
                                value={editingEmployee.salary}
                                onChange={(e) => setEditingEmployee((prev) => ({ ...prev, salary: e.target.value }))}
                                className="w-full px-3 py-2 border border-[#d2b9a3] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b18c7c]"
                            />
                        </div>
                        <div className="flex justify-between pt-4">
                            <button type="submit" className="text-[#5d4034] text-sm hover:underline">
                                ✔️ Cập nhật
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowEditForm(false);
                                    setEditingEmployee(null);
                                }}
                                className="text-[#5d4034] text-sm hover:underline"
                            >
                                ✖️ Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Bảng danh sách nhân viên */}
            <div className="overflow-x-auto rounded-lg shadow border border-[#ddd]">
                <table className="min-w-max w-full text-sm bg-white border-collapse table-auto">
                    <thead>
                        <tr className="bg-[#7a5b4a] text-[#fdfaf6]">
                            <th className="px-4 py-3 text-left border-b border-white min-w-[80px]">ID</th>
                            <th className="px-4 py-3 text-left border-b border-white min-w-[150px]">Họ tên</th>
                            <th className="px-4 py-3 text-left border-b border-white min-w-[200px]">Email</th>
                            <th className="px-4 py-3 text-left border-b border-white min-w-[130px]">Chức vụ</th>
                            <th className="px-4 py-3 text-left border-b border-white min-w-[130px]">Lương</th>
                            <th className="px-4 py-3 text-left border-b border-white min-w-[180px]">Ngày tạo</th>
                            <th className="px-4 py-3 text-left border-b border-white min-w-[160px]">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-[#6e5345]">
                                    Không có nhân viên nào.
                                </td>
                            </tr>
                        ) : (
                            employees.map((e) => (
                                <tr key={e.id} className="border-t hover:bg-[#f9f3ed]">
                                    <td className="px-4 py-3 border-b">{e.id}</td>
                                    <td className="px-4 py-3 border-b">{e.name}</td>
                                    <td className="px-4 py-3 border-b">{e.email}</td>
                                    <td className="px-4 py-3 border-b">{e.position}</td>
                                    <td className="px-4 py-3 border-b">
                                        {Number(e.salary).toLocaleString("vi-VN")} ₫
                                    </td>
                                    <td className="px-4 py-3 border-b">
                                        {new Date(e.created_at).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-4 py-3 border-b space-x-2">
                                        <button
                                            onClick={() => handleEdit(e.id)}
                                            className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(e.id)}
                                            className="px-2 py-1 bg-[#d4795b] text-white rounded hover:bg-[#bd644a]"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
