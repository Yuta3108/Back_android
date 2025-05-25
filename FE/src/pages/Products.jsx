// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Products() {
//     const [products, setProducts] = useState([]);
//     const [sizes, setSizes] = useState([]);
//     const [showSizes, setShowSizes] = useState(false);
//     const [newSize, setNewSize] = useState(""); // ✅ Thêm state này để tránh lỗi

//     // Lấy sản phẩm kèm size
//     useEffect(() => {
//         axios.get("http://localhost:5000/api/products/products-with-sizes")
//             .then(res => {
//                 const grouped = res.data.data.reduce((acc, item) => {
//                     const existing = acc.find(p => p.id === item.product_id);
//                     const sizeData = {
//                         size: item.size_name,
//                         price: item.price
//                     };

//                     if (existing) {
//                         existing.sizes.push(sizeData);
//                     } else {
//                         acc.push({
//                             id: item.product_id,
//                             name: item.product_name,
//                             category: item.category_name,
//                             image: item.image,
//                             sizes: [sizeData],
//                             createdAt: new Date().toLocaleString()
//                         });
//                     }

//                     return acc;
//                 }, []);

//                 setProducts(grouped);
//             })
//             .catch(err => {
//                 console.error("Lỗi khi gọi API:", err);
//             });
//     }, []);

//     // Lấy danh sách size có sẵn
//     const handleToggleSizes = () => {
//         if (!showSizes) {
//             axios.get("http://localhost:5000/api/size")
//                 .then(res => {
//                     setSizes(res.data.data);
//                     setShowSizes(true);
//                 })
//                 .catch(err => {
//                     console.error("Lỗi khi lấy danh sách size:", err.message);
//                 });
//         } else {
//             setShowSizes(false);
//         }
//     };

//     // ✅ Thêm size mới
//     const handleAddSize = () => {
//         if (!newSize.trim()) return;

//         axios.post("http://localhost:5000/api/size", { size: newSize })
//             .then(res => {
//                 alert("Đã thêm size thành công!");
//                 setNewSize("");
//                 // Load lại danh sách size
//                 return axios.get("http://localhost:5000/api/size");
//             })
//             .then(res => setSizes(res.data.data))
//             .catch(err => {
//                 console.error("Lỗi khi thêm size:", err.message);
//                 alert("Thêm size thất bại!");
//             });
//     };

//     return (
//         <div className="p-6 bg-[#fdfaf6] min-h-screen text-[#4b2e2e] flex flex-col items-center text-center">
//             <h2 className="text-2xl font-bold mb-4">🛒 Quản lý Sản phẩm</h2>

//             <div className="flex gap-4 mb-4">
//                 <button
//                     onClick={() => alert("Chức năng thêm sản phẩm đang phát triển")}
//                     className="bg-[#7a5b4a] hover:bg-[#5d4034] text-[#fdfaf6] font-medium py-2 px-4 rounded-lg transition"
//                 >
//                     ➕ Thêm sản phẩm
//                 </button>
//                 <button
//                     onClick={handleToggleSizes}
//                     className="bg-[#7a5b4a] hover:bg-[#7a5b4a] text-[#fdfaf6] font-medium py-2 px-4 rounded-lg transition"
//                 >
//                     ➕ Thêm size
//                 </button>
//             </div>

//             {/* Danh sách size */}
//             {/* Danh sách size */}
//             {showSizes && (
//                 <div className="bg-white shadow-md border rounded-lg p-4 mb-6 w-full max-w-md text-left">
//                     <h3 className="text-lg font-semibold mb-2">📏 Danh sách size hiện có:</h3>
//                     <ul className="divide-y max-h-60 overflow-y-auto mb-4">
//                         {sizes.map((size) => (
//                             <li key={size.masize} className="flex justify-between items-center py-2">
//                                 <span>{size.size}</span>
//                                 <div className="flex gap-2">
//                                     <button className="px-2 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 rounded text-white">
//                                         Sửa
//                                     </button>
//                                     <button className="px-2 py-1 text-sm bg-red-500 hover:bg-red-600 rounded text-white">
//                                         Xóa
//                                     </button>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>

//                     {/* Nhập size mới */}
//                     <div className="flex items-center gap-2">
//                         <input
//                             type="text"
//                             placeholder="Nhập size mới"
//                             className="border border-gray-300 rounded px-3 py-1 flex-grow"
//                             value={newSize}
//                             onChange={(e) => setNewSize(e.target.value)}
//                         />
//                         <button
//                             onClick={handleAddSize}
//                             className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//                         >
//                             Lưu
//                         </button>
//                         <button
//                             onClick={() => {
//                                 setShowSizes(false);
//                                 setNewSize(""); // reset luôn input
//                             }}
//                             className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
//                         >
//                             Huỷ
//                         </button>
//                     </div>
//                 </div>
//             )}


//             {/* Bảng sản phẩm */}
//             <table className="table-auto border-collapse w-full max-w-5xl text-left">
//                 <thead>
//                     <tr className="bg-[#8b6b5c] text-[#fdfaf6]">
//                         <th className="border px-4 py-2">ID</th>
//                         <th className="border px-4 py-2">Tên sản phẩm</th>
//                         <th className="border px-4 py-2">Phân loại</th>
//                         <th className="border px-4 py-2">Giá theo size</th>
//                         <th className="border px-4 py-2">Ngày tạo</th>
//                         <th className="border px-4 py-2">Hành động</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {products.map((product) => (
//                         <tr key={product.id} className="hover:bg-[#f0e8df]">
//                             <td className="border px-4 py-2">{product.id}</td>
//                             <td className="border px-4 py-2">{product.name}</td>
//                             <td className="border px-4 py-2">{product.category}</td>
//                             <td className="border px-4 py-2">
//                                 {product.sizes.map((size, index) => (
//                                     <div key={index}>
//                                         <span className="font-semibold">{size.size}:</span> {Number(size.price).toLocaleString()} ₫
//                                     </div>
//                                 ))}
//                             </td>
//                             <td className="border px-4 py-2">{product.createdAt}</td>
//                             <td className="border px-4 py-2">
//                                 <button className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]">Sửa</button>
//                                 <button className="px-2 py-1 bg-[#d4795b] text-white rounded hover:bg-[#bd644a]">Xóa</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [showSizes, setShowSizes] = useState(false);
    const [newSize, setNewSize] = useState("");
    const [editingSizeId, setEditingSizeId] = useState(null);
    const [editingSizeValue, setEditingSizeValue] = useState("");

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

    // Lấy danh sách size
    const fetchSizes = () => {
        axios.get("http://localhost:5000/api/size")
            .then(res => setSizes(res.data.data))
            .catch(err => console.error("Lỗi khi lấy danh sách size:", err.message));
    };

    const handleToggleSizes = () => {
        if (!showSizes) {
            fetchSizes();
        }
        setShowSizes(!showSizes);
        setNewSize("");
        setEditingSizeId(null);
    };

    const handleAddSize = () => {
        if (!newSize.trim()) return;

        axios.post("http://localhost:5000/api/size", { size: newSize })
            .then(() => {
                alert("Đã thêm size thành công!");
                setNewSize("");
                fetchSizes();
            })
            .catch(err => {
                console.error("Lỗi khi thêm size:", err.message);
                alert("Thêm size thất bại!");
            });
    };



    const handleEditClick = (size) => {
        setEditingSizeId(size.masize);
        setEditingSizeValue(size.size);
    };

    const handleUpdateSize = () => {
        if (!editingSizeValue.trim()) return;

        axios.put(`http://localhost:5000/api/size/${editingSizeId}`, { size: editingSizeValue })
            .then(() => {
                alert("Đã cập nhật size thành công!");
                setEditingSizeId(null);
                setEditingSizeValue("");
                fetchSizes();
            })
            .catch(err => {
                console.error("Lỗi khi cập nhật size:", err.message);
                alert("Cập nhật size thất bại!");
            });
    };

    const handleCancelEdit = () => {
        setEditingSizeId(null);
        setEditingSizeValue("");
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
                    className="bg-[#7a5b4a] hover:bg-[#5d4034] text-[#fdfaf6] font-medium py-2 px-4 rounded-lg transition"
                >
                    ➕ Thêm size
                </button>
            </div>

            {showSizes && (
                <div className="bg-white shadow-md border rounded-lg p-4 mb-6 w-full max-w-md text-left">
                    <h3 className="text-lg font-semibold mb-2">📏 Danh sách size hiện có:</h3>
                    <ul className="divide-y max-h-60 overflow-y-auto mb-4">
                        {sizes.map((size) => (
                            <li key={size.masize} className="flex justify-between items-center py-2">
                                {editingSizeId === size.masize ? (
                                    <input
                                        value={editingSizeValue}
                                        onChange={(e) => setEditingSizeValue(e.target.value)}
                                        className="border rounded px-2 py-1 flex-grow mr-2"
                                    />
                                ) : (
                                    <span>{size.size}</span>
                                )}
                                <div className="flex gap-2">
                                    {editingSizeId === size.masize ? (
                                        <>
                                            <button
                                                onClick={handleUpdateSize}
                                                className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]"
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-2 py-1 bg-[#d4795b] text-white rounded hover:bg-[#bd644a]"
                                            >
                                                Huỷ
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEditClick(size)}
                                                className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]"
                                            >
                                                Sửa
                                            </button>

                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Nhập size mới */}
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Nhập size mới"
                            className="border border-gray-300 rounded px-3 py-1 flex-grow"
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                        />
                        <button
                            onClick={handleAddSize}
                            className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]"
                        >
                            Lưu
                        </button>
                        <button
                            onClick={handleToggleSizes}
                            className="px-2 py-1 bg-[#d4795b] text-white rounded hover:bg-[#bd644a]"
                        >
                            Huỷ
                        </button>
                    </div>
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
                                        <span className="font-semibold">{size.size}:</span>{" "}
                                        {Number(size.price).toLocaleString()} ₫
                                    </div>
                                ))}
                            </td>
                            <td className="border px-4 py-2">{product.createdAt}</td>
                            <td className="border px-4 py-2">
                                <button className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]">Sửa</button>
                                <button className="px-2 py-1 bg-[#d4795b] text-white rounded hover:bg-[#bd644a]">Xoá</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

