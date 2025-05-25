
import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [showSizes, setShowSizes] = useState(false);

    // Lấy sản phẩm kèm size
    useEffect(() => {
        axios.get("http://localhost:5000/api/products/products-with-sizes")
            .then(res => {
                const grouped = res.data.data.reduce((acc, item) => {
                    const existing = acc.find(p => p.id === item.product_id);
                    const sizeData = {
                        size: item.size_name,
                        price: item.price
                    };

                    if (existing) {
                        existing.sizes.push(sizeData);
                    } else {
                        acc.push({
                            id: item.product_id,
                            name: item.product_name,
                            category: item.category_name,
                            image: item.image,
                            sizes: [sizeData],
                            createdAt: new Date().toLocaleString()
                        });
                    }

                    return acc;
                }, []);

                setProducts(grouped);
            })
            .catch(err => {
                console.error("Lỗi khi gọi API:", err);
            });
    }, []);

    // Lấy danh sách size có sẵn
    const handleToggleSizes = () => {
        if (!showSizes) {
            axios.get("http://localhost:5000/api/size")
                .then(res => {
                    setSizes(res.data.data);
                    setShowSizes(true);
                })
                .catch(err => {
                    console.error("Lỗi khi lấy danh sách size:", err.message);
                });
        } else {
            setShowSizes(false);
        }
    };

    return (
        <div className="p-6 bg-[#fdfaf6] min-h-screen text-[#4b2e2e] flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-4">🛒 Quản lý Sản phẩm</h2>

            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => alert("Chức năng thêm sản phẩm đang phát triển")}
                    className="bg-[#7a5b4a] hover:bg-[#5d4034] text-[#fdfaf6] font-medium py-2 px-4 rounded-lg transition"
                >
                    ➕ Thêm sản phẩm
                </button>
                <button
                    onClick={handleToggleSizes}
                    className="bg-[#4a7a5b] hover:bg-[#355e45] text-[#fdfaf6] font-medium py-2 px-4 rounded-lg transition"
                >
                    ➕ Thêm size
                </button>
            </div>

            {/* Danh sách size hiện bên dưới nếu mở */}
            {showSizes && (
                <div className="bg-white shadow-md border rounded-lg p-4 mb-6 w-full max-w-md text-left">
                    <h3 className="text-lg font-semibold mb-2">📏 Danh sách size hiện có:</h3>
                    <ul className="divide-y max-h-60 overflow-y-auto">
                        {sizes.map((size) => (
                            <li key={size.masize} className="flex justify-between items-center py-2">
                                <span>{size.size}</span>
                                <div className="flex gap-2">
                                    <button className="px-2 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 rounded text-white">
                                        Sửa
                                    </button>
                                    <button className="px-2 py-1 text-sm bg-red-500 hover:bg-red-600 rounded text-white">
                                        Xóa
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Bảng sản phẩm */}
            <table className="table-auto border-collapse w-full max-w-5xl text-left">
                <thead>
                    <tr className="bg-[#8b6b5c] text-[#fdfaf6]">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Tên sản phẩm</th>
                        <th className="border px-4 py-2">Phân loại</th>
                        <th className="border px-4 py-2">Giá theo size</th>
                        <th className="border px-4 py-2">Ngày tạo</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-[#f0e8df]">
                            <td className="border px-4 py-2">{product.id}</td>
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{product.category}</td>
                            <td className="border px-4 py-2">
                                {product.sizes.map((size, index) => (
                                    <div key={index}>
                                        <span className="font-semibold">{size.size}:</span> {Number(size.price).toLocaleString()} ₫
                                    </div>
                                ))}
                            </td>
                            <td className="border px-4 py-2">{product.createdAt}</td>
                            <td className="border px-4 py-2">
                                <button className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]">Sửa</button>
                                <button className="px-2 py-1 bg-[#d4795b] text-white rounded hover:bg-[#bd644a]">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

