import React, { useEffect, useState } from 'react';
import axios from 'axios';

const User = () => {
    const [customers, setCustomers] = useState([]);

    // Hàm lấy danh sách khách hàng
    const fetchCustomers = () => {
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                setCustomers(response.data.users);
            })
            .catch(error => {
                console.error('Lỗi khi lấy danh sách khách hàng:', error);
            });
    };

    useEffect(() => {
        fetchCustomers(); // Gọi khi component được mount
    }, []);

    // ✅ Hàm xóa khách hàng
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xoá khách hàng này không?")) {
            axios.delete(`http://localhost:5000/api/users/${id}`)
                .then(() => {
                    alert("Xoá thành công!");
                    fetchCustomers(); // Cập nhật lại danh sách sau khi xoá
                })
                .catch(error => {
                    console.error("Lỗi khi xoá khách hàng:", error);
                    alert("Xoá thất bại. Vui lòng thử lại!");
                });
        }
    };

    return (
        <div className="p-8 bg-[#fdf7f2] min-h-screen">
            <h1 className="text-3xl font-bold text-center text-[#522d0b] flex items-center justify-center gap-2 mb-6">
                <span role="img" aria-label="user">👥</span> Quản lý Khách hàng
            </h1>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#7b4f27] text-[#fdfaf6] text-left">
                            <th className="p-2">ID</th>
                            <th className="p-2">Họ tên</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Số điện thoại</th>
                            <th className="p-2">Địa chỉ</th>
                            <th className="p-2">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((cus, index) => (
                            <tr key={index} className="border-b hover:bg-[#f0e6dc]">
                                <td className="p-2">{cus.id}</td>
                                <td className="p-2">{cus.name}</td>
                                <td className="p-2">{cus.email}</td>
                                <td className="p-2">{cus.phone}</td>
                                <td className="p-2">{cus.address}</td>
                                <td className="p-2">
                                    <button
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        onClick={() => handleDelete(cus.id)} // ✅ Gắn hàm xóa
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default User;
