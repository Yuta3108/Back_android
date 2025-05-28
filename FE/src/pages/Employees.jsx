import { useEffect, useState } from "react";
import axios from "axios";

export default function Employees() {
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
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
            alert("Xoá nhân viên thành công");
        } catch (err) {
            console.error("Lỗi khi xoá nhân viên:", err);
            alert("Lỗi khi xoá nhân viên");
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
            alert("Thêm nhân viên thành công");

            setNewEmployee({ name: "", email: "", position: "", salary: "" });
            setShowAddForm(false);
        } catch (err) {
            console.error("Lỗi khi thêm nhân viên:", err);
            if (err.response?.status === 409) {
                alert("Email đã tồn tại");
            } else {
                alert("Lỗi khi thêm nhân viên");
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
        <div className="p-8 bg-[#ffffff] min-h-screen text-[#5a3825] font-sans">
            <h2 className="text-3xl font-bold text-center mb-10 text-[#5a3825]">
                👥 Quản lý Nhân viên
            </h2>

            <div className="flex justify-center mb-6">
                <button
                    onClick={handleAdd}
                    className="bg-[#a47148] text-white font-medium py-2 px-5 rounded-full hover:bg-[#8a5a35] transition"
                >
                    ➕ Thêm nhân viên
                </button>
            </div>

            {(showAddForm || (showEditForm && editingEmployee)) && (
                <div className="max-w-md mx-auto bg-[#f5eade] border border-[#e0cdbf] rounded-2xl shadow-md p-6 mb-8">
                    <h3 className="text-xl font-semibold text-center mb-4">
                        {showAddForm ? "📝 Thêm nhân viên" : "🛠️ Sửa nhân viên"}
                    </h3>
                    <form onSubmit={showAddForm ? handleSubmitNewEmployee : handleSubmitEditEmployee} className="space-y-4">
                        {['name', 'email', 'position', 'salary'].map((field) => (
                            <div key={field}>
                                <label className="block text-sm mb-1 text-[#5a3825] font-medium">
                                    {field === 'name' ? '👤 Họ tên' :
                                        field === 'email' ? '📧 Email' :
                                            field === 'position' ? '🏷️ Chức vụ' : '💰 Lương'}
                                </label>
                                <input
                                    type={field === 'email' ? 'email' : field === 'salary' ? 'number' : 'text'}
                                    name={field}
                                    value={showAddForm ? newEmployee[field] : editingEmployee[field]}
                                    onChange={(e) => showAddForm
                                        ? setNewEmployee((prev) => ({ ...prev, [field]: e.target.value }))
                                        : setEditingEmployee((prev) => ({ ...prev, [field]: e.target.value }))
                                    }
                                    className="w-full px-4 py-2 bg-white border border-[#d4bfae] text-[#5a3825] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a47148]"
                                />
                            </div>
                        ))}

                        <div className="flex justify-between pt-4">
                            <button type="submit" className="text-[#a47148] hover:underline">
                                ✔️ {showAddForm ? "Thêm" : "Cập nhật"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    showAddForm ? setShowAddForm(false) : setShowEditForm(false);
                                    setEditingEmployee(null);
                                }}
                                className="text-[#aaaaaa] hover:underline"
                            >
                                ✖️ Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto rounded-2xl shadow-md border border-[#e0cdbf]">
                <table className="min-w-full text-sm bg-white text-black border border-[#ccc] table-auto rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-[#D2B48C] text-black text-center">
                            <th className="px-5 py-3 border border-[#ccc]">ID</th>
                            <th className="px-5 py-3 border border-[#ccc]">Họ tên</th>
                            <th className="px-5 py-3 border border-[#ccc]">Email</th>
                            <th className="px-5 py-3 border border-[#ccc]">Chức vụ</th>
                            <th className="px-5 py-3 border border-[#ccc]">Lương</th>
                            <th className="px-5 py-3 border border-[#ccc]">Ngày tạo</th>
                            <th className="px-5 py-3 border border-[#ccc]">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-[#888] border border-[#ccc]">
                                    Không có nhân viên nào.
                                </td>
                            </tr>
                        ) : (
                            employees.map((e) => (
                                <tr key={e.id} className="hover:bg-[#f8f5f0] text-center">
                                    <td className="px-5 py-3 border border-[#ccc]">{e.id}</td>
                                    <td className="px-5 py-3 border border-[#ccc]">{e.name}</td>
                                    <td className="px-5 py-3 border border-[#ccc]">{e.email}</td>
                                    <td className="px-5 py-3 border border-[#ccc]">{e.position}</td>
                                    <td className="px-5 py-3 border border-[#ccc]">
                                        {Number(e.salary).toLocaleString("vi-VN")} ₫
                                    </td>
                                    <td className="px-5 py-3 border border-[#ccc]">
                                        {new Date(e.created_at).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-5 py-3 border border-[#ccc] space-x-2">
                                        <button
                                            onClick={() => handleEdit(e.id)}
                                            className="px-3 py-1 bg-[#D2B48C] text-white rounded-full hover:bg-[#e0cdbf]"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(e.id)}
                                            className="px-3 py-1 bg-[#D2B48C] text-white rounded-full hover:bg-[#e0cdbf]"
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
