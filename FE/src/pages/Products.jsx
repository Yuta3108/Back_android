import { useEffect, useState } from "react";
import axios from "axios";
export default function Products() {
    const [products, setProducts] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [showSizes, setShowSizes] = useState(false);
    const [newSize, setNewSize] = useState("");
    const [editingSizeId, setEditingSizeId] = useState(null);
    const [editingSizeValue, setEditingSizeValue] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddSizePriceModal, setShowAddSizePriceModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [sizePriceList, setSizePriceList] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editProduct, setEditProduct] = useState({
        id: null,
        name: "",
        category_id: "",
        sizePrices: []
    });
    const [newProduct, setNewProduct] = useState({
        name: "",
        image: "",
        category: "",
        sizePrices: []
    });
    const handleEditProduct = (product) => {
        // Chuẩn hoá lại sizePrices từ dữ liệu hiện có
        const sizePrices = product.sizes.map(s => ({
            sizeId: sizes.find(sz => sz.size === s.size)?.masize,
            price: s.price
        }));

        setEditProduct({
            id: product.id,
            name: product.name,
            category_id: categories.find(c => c.name === product.category)?.id || "",
            sizePrices
        });
        fetchSizes(); // Đảm bảo có danh sách size
        setShowEditModal(true);
    };

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/categories");
                setCategories(res.data); // sửa nếu res.data là { categories: [...] }
            } catch (err) {
                console.error("Lỗi khi lấy phân loại:", err.message);
            }
        };
        fetchCategories();
    }, []);
    useEffect(() => {
        fetchProducts();
    }, []);
    const fetchProducts = () => {
        axios.get("http://localhost:5000/api/products/products-with-sizes")
            .then(res => {
                const grouped = res.data?.data?.reduce?.((acc, item) => {
                    const existing = acc.find(p => p.id === item.product_id);
                    const sizeData = { size: item.size_name, price: item.price };
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
                }, []) || [];
                setProducts(grouped);
            })
            .catch(err => console.error("Lỗi khi gọi API:", err));
    };
    const fetchSizes = () => {
        axios.get("http://localhost:5000/api/size")
            .then(res => setSizes(res.data?.data || []))
            .catch(err => console.error("Lỗi khi lấy danh sách size:", err.message));
    };
    const handleToggleSizes = () => {
        if (!showSizes) fetchSizes();
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
    const handleDeleteProduct = (productId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) return;

        axios.delete(`http://localhost:5000/api/products/${productId}`)
            .then(() => {
                alert("Đã xoá sản phẩm thành công!");
                fetchProducts(); // reload lại danh sách sau khi xoá
            })
            .catch(err => {
                console.error("Lỗi khi xoá sản phẩm:", err.message);
                alert("Xoá sản phẩm thất bại!");
            });
    };

    const handleDeleteSize = (masize) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá size này không?")) return;
        axios.delete(`http://localhost:5000/api/size/${masize}`)
            .then(() => {
                alert("Đã xoá size thành công!");
                fetchSizes();
            })
            .catch((err) => {
                const msg = err.response?.data?.message || "Xoá size thất bại!";
                if (err.response?.status === 400 && msg.includes("đang được sử dụng")) {
                    alert("Không thể xoá size vì đang được sử dụng trong sản phẩm!");
                } else {
                    alert(msg);
                }
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
    const toggleSizeSelection = (sizeId) => {
        const exists = newProduct.sizePrices.find(sp => sp.sizeId === sizeId);
        if (exists) {
            setNewProduct(prev => ({
                ...prev,
                sizePrices: prev.sizePrices.filter(sp => sp.sizeId !== sizeId)
            }));
        } else {
            setNewProduct(prev => ({
                ...prev,
                sizePrices: [...prev.sizePrices, { sizeId, price: "" }]
            }));
        }
    };
    const handlePriceChange = (sizeId, price) => {
        setNewProduct(prev => ({
            ...prev,
            sizePrices: prev.sizePrices.map(sp =>
                sp.sizeId === sizeId ? { ...sp, price } : sp
            )
        }));
    };
    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const sizesFormatted = newProduct.sizePrices.map(sp => ({
                masize: sp.sizeId,
                gia: Number(sp.price)
            }));

            const payload = {
                name: newProduct.name,
                category_id: Number(newProduct.category), // ✅ đảm bảo là số
                sizes: sizesFormatted
            };

            await axios.post("http://localhost:5000/api/products", payload);
            alert("Đã thêm sản phẩm thành công!");
            setShowAddModal(false);
            fetchProducts();
        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm:", err.message);
            alert("Thêm sản phẩm thất bại!");
        }
    };
    const isSizeSelected = (sizeId) => {
        return newProduct.sizePrices.some(sp => sp.sizeId === sizeId);
    };
    const getSizePrice = (sizeId) => {
        const found = newProduct.sizePrices.find(sp => sp.sizeId === sizeId);
        return found?.price || "";
    };
    return (
        <div className="p-6 bg-[#fdfaf6] min-h-screen text-[#4b2e2e] flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-4">🛒 Quản lý Sản phẩm</h2>

            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={() => {
                        fetchSizes();
                        setNewProduct({ name: "", image: "", category: "", sizePrices: [] });
                        setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 bg-[#7a5b4a] hover:bg-[#5d4034] text-[#fdfaf6] font-medium text-sm py-2.5 px-5 rounded-lg transition"
                >
                    <span>➕</span> Thêm sản phẩm
                </button>
                <button
                    onClick={handleToggleSizes}
                    className="flex items-center gap-2 bg-[#7a5b4a] hover:bg-[#5d4034] text-[#fdfaf6] font-medium text-sm py-2.5 px-5 rounded-lg transition"
                >
                    <span>➕</span> Thêm size
                </button>
                <button
                    onClick={() => {
                        fetchSizes();
                        fetchProducts();
                        setSelectedProductId("");
                        setSizePriceList([]);
                        setShowAddSizePriceModal(true);
                    }}
                    className="flex items-center gap-2 bg-[#7a5b4a] hover:bg-[#5d4034] text-[#fdfaf6] font-medium text-sm py-2.5 px-5 rounded-lg transition"
                >
                    <span>➕</span> Thêm giá theo size
                </button>

            </div>

            {/* Modal Thêm Sản Phẩm */}
            {showAddModal && (
                <div className="bg-white shadow-md border rounded-lg p-4 mb-6 w-full max-w-2xl text-left">
                    <h2 className="text-lg font-semibold mb-4">➕ Thêm sản phẩm mới</h2>
                    <form onSubmit={handleAddProduct} className="space-y-4 text-lg">
                        <input
                            type="text"
                            placeholder="Tên sản phẩm"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-lg"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            required
                        />

                        <select
                            className="w-full border border-gray-300 rounded px-3 py-2 text-lg"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            required
                        >
                            <option value="">-- Chọn phân loại --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <label className="font-medium text-lg">Chọn size và nhập giá:</label>
                        <div className="grid grid-cols-2 gap-4">
                            {sizes.map((size) => (
                                <div key={size.masize} className="flex items-center gap-2 text-lg">
                                    <input
                                        type="checkbox"
                                        checked={isSizeSelected(size.masize)}
                                        onChange={() => toggleSizeSelection(size.masize)}
                                    />
                                    <label>{size.size}</label>
                                    {isSizeSelected(size.masize) && (
                                        <input
                                            type="number"
                                            placeholder={`Giá ${size.size}`}
                                            className="border border-gray-300 rounded px-2 py-1 w-full text-lg"
                                            value={getSizePrice(size.masize)}
                                            onChange={(e) => handlePriceChange(size.masize, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#c2a28b] text-white rounded hover:bg-[#b3907c] text-lg"
                            >
                                Lưu
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-[#d4795b] text-white rounded hover:bg-[#bd644a] text-lg"
                                onClick={() => setShowAddModal(false)}
                            >
                                Huỷ
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {/* Modal Quản lý Size */}
            {showSizes && (
                <div className="bg-white shadow-md border rounded-lg p-4 mb-6 w-full max-w-md text-left">
                    <h3 className="text-lg font-semibold mb-2">📏 Danh sách size hiện có:</h3>
                    <ul className="divide-y max-h-60 overflow-y-auto mb-4">
                        {Array.isArray(sizes) && sizes.map(size => (
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
                                            <button onClick={handleUpdateSize} className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]">Lưu</button>
                                            <button onClick={handleCancelEdit} className="px-2 py-1 bg-[#d4795b] text-white rounded hover:bg-[#bd644a]">Huỷ</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditClick(size)} className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]">Sửa</button>
                                            <button onClick={() => handleDeleteSize(size.masize)} className="px-2 py-1 bg-[#d4795b] text-white rounded hover:bg-[#bd644a]">Xoá</button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Nhập size mới"
                            className="border border-gray-300 rounded px-3 py-1 flex-grow"
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                        />
                        <button onClick={handleAddSize} className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]">Lưu</button>
                        <button onClick={handleToggleSizes} className="px-2 py-1 bg-[#d4795b] text-white rounded hover:bg-[#bd644a]">Huỷ</button>
                    </div>
                </div>
            )}
            {/* Modal Thêm giá theo size */}
            {showAddSizePriceModal && (
                <div className="bg-white shadow-md border rounded-lg p-4 mb-6 w-full max-w-2xl text-left">
                    <h2 className="text-lg font-semibold mb-4">➕ Thêm giá theo size</h2>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Chọn sản phẩm:</label>
                        <select
                            className="w-full border border-gray-300 rounded px-3 py-2 text-lg"
                            value={selectedProductId}
                            onChange={(e) => {
                                setSelectedProductId(e.target.value);
                                setSizePriceList([]); // reset size selection
                            }}
                        >
                            <option value="">-- Chọn sản phẩm --</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedProductId && (
                        <>
                            <label className="font-medium text-lg">Chọn size và nhập giá:</label>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {sizes.map((size) => {
                                    const isSelected = sizePriceList.some(s => s.masize === size.masize);
                                    const price = sizePriceList.find(s => s.masize === size.masize)?.gia || "";

                                    return (
                                        <div key={size.masize} className="flex items-center gap-2 text-lg">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {
                                                    if (isSelected) {
                                                        setSizePriceList(prev => prev.filter(s => s.masize !== size.masize));
                                                    } else {
                                                        setSizePriceList(prev => [...prev, { masize: size.masize, gia: "" }]);
                                                    }
                                                }}
                                            />
                                            <label>{size.size}</label>
                                            {isSelected && (
                                                <input
                                                    type="number"
                                                    placeholder="Giá"
                                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                                    value={price}
                                                    onChange={(e) => {
                                                        const newPrice = e.target.value;
                                                        setSizePriceList(prev =>
                                                            prev.map(sp =>
                                                                sp.masize === size.masize ? { ...sp, gia: newPrice } : sp
                                                            )
                                                        );
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={async () => {
                                        try {
                                            for (const sp of sizePriceList) {
                                                const payload = {
                                                    masize: sp.masize,
                                                    gia: Number(sp.gia),
                                                };
                                                await axios.post(`http://localhost:5000/api/products/${selectedProductId}/add-size`, payload);
                                            }
                                            alert("Đã thêm giá theo size!");
                                            setShowAddSizePriceModal(false);
                                            fetchProducts();
                                        } catch (err) {
                                            console.error(err);
                                            alert("Thêm giá theo size thất bại!");
                                        }
                                    }}
                                    className="px-4 py-2 bg-[#c2a28b] text-white rounded hover:bg-[#b3907c] text-lg"
                                >
                                    Lưu
                                </button>
                                <button
                                    onClick={() => setShowAddSizePriceModal(false)}
                                    className="px-4 py-2 bg-[#d4795b] text-white rounded hover:bg-[#bd644a] text-lg"
                                >
                                    Huỷ
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
            {/* Modal sửa sản phẩm */}
            {showEditModal && (
                <div className="bg-white shadow-md border rounded-lg p-4 mb-6 w-full max-w-2xl text-left">
                    <div className="bg-white p-6 rounded shadow-md w-[500px]">
                        <h3 className="text-lg font-bold mb-4">✏️ Sửa sản phẩm</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const validSizePrices = editProduct.sizePrices
                                    .filter(sp => sp.price !== "" && !isNaN(Number(sp.price)))
                                    .map(sp => ({
                                        masize: sp.sizeId,
                                        gia: Number(sp.price)
                                    }));

                                const payload = {
                                    name: editProduct.name,
                                    category_id: Number(editProduct.category_id),
                                    sizes: validSizePrices
                                };

                                await axios.put(`http://localhost:5000/api/products/up/${editProduct.id}`, payload);
                                alert("Cập nhật sản phẩm thành công!");
                                setShowEditModal(false);
                                fetchProducts();
                            } catch (err) {
                                console.error("Lỗi khi cập nhật:", err.message);
                                alert("Cập nhật sản phẩm thất bại!");
                            }
                        }}>

                            <input
                                className="border w-full p-2 mb-2"
                                value={editProduct.name}
                                onChange={(e) => setEditProduct(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Tên sản phẩm"
                                required
                            />
                            <select
                                className="border w-full p-2 mb-2"
                                value={editProduct.category_id}
                                onChange={(e) => setEditProduct(prev => ({ ...prev, category_id: e.target.value }))}
                                required
                            >
                                <option value="">-- Chọn phân loại --</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>

                            {sizes.map(sz => (
                                <div key={sz.masize} className="flex items-center mb-2 gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editProduct.sizePrices.some(sp => sp.sizeId === sz.masize)}
                                        onChange={() => {
                                            const exists = editProduct.sizePrices.find(sp => sp.sizeId === sz.masize);
                                            if (exists) {
                                                setEditProduct(prev => ({
                                                    ...prev,
                                                    sizePrices: prev.sizePrices.filter(sp => sp.sizeId !== sz.masize)
                                                }));
                                            } else {
                                                setEditProduct(prev => ({
                                                    ...prev,
                                                    sizePrices: [...prev.sizePrices, { sizeId: sz.masize, price: "" }]
                                                }));
                                            }
                                        }}
                                    />
                                    <label>{sz.size}</label>
                                    <input
                                        type="number"
                                        className="border p-1 flex-1"
                                        placeholder="Giá"
                                        value={
                                            editProduct.sizePrices.find(sp => sp.sizeId === sz.masize)?.price || ""
                                        }
                                        onChange={(e) => {
                                            const price = e.target.value;
                                            setEditProduct(prev => ({
                                                ...prev,
                                                sizePrices: prev.sizePrices.map(sp =>
                                                    sp.sizeId === sz.masize ? { ...sp, price } : sp
                                                )
                                            }));
                                        }}
                                    />
                                </div>
                            ))}

                            <div className="flex justify-end mt-4 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#7a5b4a] text-white rounded hover:bg-[#5d4034]"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Danh sách sản phẩm */}
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
                    {Array.isArray(products) && products.map(product => (
                        <tr key={product.id} className="hover:bg-[#f0e8df]">
                            <td className="border px-4 py-2">{product.id}</td>
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{product.category}</td>

                            <td className="border px-4 py-2">
                                {Array.isArray(product.sizes)
                                    ? product.sizes.map((size, i) => (
                                        <div key={i}>
                                            <span className="font-semibold">{size.size}:</span>{" "}
                                            {Number(size.price).toLocaleString()} ₫
                                        </div>
                                    ))
                                    : <span className="text-gray-500 italic">Không có size</span>}
                            </td>
                            <td className="border px-4 py-2">{product.createdAt}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleEditProduct(product)}
                                    className="mr-2 px-2 py-1 bg-[#c2a28b] rounded hover:bg-[#b3907c]"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="px-2 py-1 bg-[#d4795b] text-white rounded hover:bg-[#bd644a]"
                                >
                                    Xoá
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}