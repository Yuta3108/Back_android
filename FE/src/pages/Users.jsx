import React, { useEffect, useState } from 'react';
import axios from 'axios';

const User = () => {
    const [customers, setCustomers] = useState([]);

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
        fetchCustomers();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xoá khách hàng này không?")) {
            axios.delete(`http://localhost:5000/api/users/${id}`)
                .then(() => {
                    alert("Xoá thành công!");
                    fetchCustomers();
                })
                .catch(error => {
                    console.error("Lỗi khi xoá khách hàng:", error);
                    alert("Xoá thất bại. Vui lòng thử lại!");
                });
        }
    };

    return (
        <div className="bg-[#fdf6f0] min-h-screen p-6">
            <h1 className="text-3xl font-bold text-center text-[#4e2d1e] flex items-center justify-center gap-2 mb-2">
                <span role="img" aria-label="user">👥</span> Quản lý Khách hàng
            </h1>
            <p className="text-center text-[#704f38] mb-6">
                Theo dõi và xoá khách hàng trong hệ thống.
            </p>

            <div className="overflow-x-auto">
                <table className="w-full border border-[#caa67a] text-sm text-center">
                    <thead>
                        <tr className="bg-[#caa67a] text-[#fff]">
                            <th className="p-2 border border-[#caa67a]">ID</th>
                            <th className="p-2 border border-[#caa67a]">Họ tên</th>
                            <th className="p-2 border border-[#caa67a]">Email</th>
                            <th className="p-2 border border-[#caa67a]">Số điện thoại</th>
                            <th className="p-2 border border-[#caa67a]">Địa chỉ</th>
                            <th className="p-2 border border-[#caa67a]">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((cus, index) => (
                            <tr key={index} className="hover:bg-[#f1e3d3] transition">
                                <td className="p-2 border border-[#e6d2b2]">{cus.id}</td>
                                <td className="p-2 border border-[#e6d2b2]">{cus.name}</td>
                                <td className="p-2 border border-[#e6d2b2]">{cus.email}</td>
                                <td className="p-2 border border-[#e6d2b2]">{cus.phone}</td>
                                <td className="p-2 border border-[#e6d2b2]">{cus.address}</td>
                                <td className="p-2 border border-[#e6d2b2]">
                                    <button
                                        className="px-4 py-1 rounded-full bg-[#D2B48C] text-white hover:bg-[#e0cdbf] transition-all"
                                        onClick={() => handleDelete(cus.id)}
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-[#8b5c3e]">
                                    Không có khách hàng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default User;
