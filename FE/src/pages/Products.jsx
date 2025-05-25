export default function Products() {
    const products = [
        { id: 1, name: "Cà phê sữa", category: "Đồ uống", price: "25.000 ₫", createdAt: "09:00:00 5/5/2025" },
        { id: 2, name: "Trà đào", category: "Đồ uống", price: "30.000 ₫", createdAt: "09:15:00 5/5/2025" },
        { id: 3, name: "Bánh mì", category: "Thức ăn", price: "15.000 ₫", createdAt: "09:30:00 5/5/2025" },
        { id: 4, name: "Bánh ngọt", category: "Thức ăn", price: "20.000 ₫", createdAt: "10:00:00 5/5/2025" },
    ];

    return (
        <div className="p-6 bg-[#fdfaf6] min-h-screen text-[#4b2e2e] flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-4">🛒 Quản lý Sản phẩm</h2>
            <button
                onClick
                className="bg-[#7a5b4a] hover:bg-[#5d4034] text-[#fdfaf6] font-medium py-2 px-4 rounded-lg transition"
            >
                ➕ Thêm sản phẩm
            </button>
            <table className="table-auto border-collapse w-full max-w-5xl text-left">
                <thead>
                    <tr className="bg-[#8b6b5c] text-[#fdfaf6]">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Tên sản phẩm</th>
                        <th className="border px-4 py-2">Phân loại</th>
                        <th className="border px-4 py-2">Giá</th>
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
                            <td className="border px-4 py-2">{product.price}</td>
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
