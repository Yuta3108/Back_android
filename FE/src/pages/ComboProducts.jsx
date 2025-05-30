import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ComboManager = () => {
  // State variables for products, sizes, combos, image file, combo form data, and editing ID
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [combos, setCombos] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [comboForm, setComboForm] = useState({ name: '', price: '', items: [] });
  const [editingComboId, setEditingComboId] = useState(null);
  // State to control the visibility of the combo creation/edit form
  const [showForm, setShowForm] = useState(false);
  // State for loading indicators
  const [isLoading, setIsLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState(null);

  // useEffect hook to fetch initial data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchProducts(),
          fetchSizes(),
          fetchCombos()
        ]);
      } catch (err) {
        setError("Không thể tải dữ liệu ban đầu. Vui lòng thử lại.");
        console.error("Lỗi khi tải dữ liệu ban đầu:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to fetch product data from the API
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      throw error; // Re-throw to be caught by the fetchData Promise.all
    }
  };

  // Function to fetch size data from the API
  const fetchSizes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/size');
      setSizes(res.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách size:", error);
      throw error;
    }
  };

  // Function to fetch combo data from the API
  const fetchCombos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/combos');
      setCombos(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách combo:", error);
      throw error;
    }
  };

  // Function to add a new empty product item row to the combo form
  const addProductToCombo = () => {
    setComboForm((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: '', size_id: '', quantity: 1 }],
    }));
  };

  // Function to update a specific field (product_id, size_id, quantity) for a product item
  const updateProductItem = (index, field, value) => {
    const updatedItems = [...comboForm.items];
    updatedItems[index][field] = value;
    setComboForm({ ...comboForm, items: updatedItems });
  };

  // Function to remove a product item from the combo form
  const removeProductItem = (index) => {
    setComboForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Function to reset the combo form to its initial empty state
  const resetForm = () => {
    setComboForm({ name: '', price: '', items: [] });
    setImageFile(null); // Clear any selected image file
    setEditingComboId(null); // Clear the editing ID
    setError(null); // Clear any previous errors
  };

  // Function to handle the submission of the combo form (either creating a new combo or updating an existing one)
  const handleSubmit = async () => {
    setError(null); // Clear previous errors on new submission attempt

    // Basic validation: check if name, price are filled and at least one item is added
    if (!comboForm.name.trim() || !comboForm.price) {
      setError('Vui lòng điền đầy đủ Tên Combo và Giá.');
      return;
    }
    if (comboForm.items.length === 0) {
      setError('Vui lòng thêm ít nhất một sản phẩm vào combo.');
      return;
    }
    if (comboForm.items.some(item => !item.product_id || !item.size_id || item.quantity <= 0)) {
        setError('Vui lòng chọn Sản phẩm, Size và nhập Số lượng hợp lệ cho tất cả các sản phẩm trong combo.');
        return;
    }


    // Create FormData object to send form data, including the image file
    const formData = new FormData();
    formData.append('name', comboForm.name);
    formData.append('price', comboForm.price);
    if (imageFile) formData.append('image', imageFile); // Append image only if selected
    formData.append('items', JSON.stringify(comboForm.items)); // Stringify items array

    try {
      if (editingComboId) {
        // If editingComboId exists, it means we are updating an existing combo
        await axios.put(`http://localhost:5000/api/combos/${editingComboId}`, formData);
        alert('Cập nhật combo thành công!'); // User feedback
      } else {
        // Otherwise, we are creating a new combo
        await axios.post('http://localhost:5000/api/combos', formData);
        alert('Tạo combo mới thành công!'); // User feedback
      }
      resetForm(); // Reset the form after successful submission
      fetchCombos(); // Refresh the list of combos to show the latest changes
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error("Lỗi khi gửi combo:", error);
      setError(`Lỗi khi ${editingComboId ? 'cập nhật' : 'tạo mới'} combo: ${error.response?.data?.message || error.message}. Vui lòng thử lại.`);
    }
  };

  // Function to handle editing an existing combo
  const handleEdit = (combo) => {
    setEditingComboId(combo.id); // Set the ID of the combo being edited
    setComboForm({ // Populate the form with the combo's existing data
      name: combo.name,
      price: combo.price,
      items: combo.items.map((item) => ({ // Map items to match form structure
        product_id: item.product_id,
        size_id: item.size_id,
        quantity: item.quantity,
      })),
    });
    setImageFile(null); // Clear the image file input when editing (user can re-upload if needed)
    setShowForm(true); // Show the form when editing a combo
    setError(null); // Clear any errors when opening edit form
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page for better UX
  };

  // Function to handle deleting a combo
  const handleDelete = async (id) => {
    // In a production environment, replace window.confirm with a custom modal for confirmation
    if (window.confirm('Bạn có chắc chắn muốn xoá combo này không? Hành động này không thể hoàn tác!')) {
      try {
        await axios.delete(`http://localhost:5000/api/combos/${id}`);
        fetchCombos(); // Refresh the combo list after deletion
        alert('Xoá combo thành công!'); // User feedback
      } catch (error) {
        console.error("Lỗi khi xoá combo:", error);
        alert(`Lỗi khi xoá combo: ${error.response?.data?.message || error.message}. Vui lòng thử lại.`);
      }
    }
  };

  // Function to toggle the visibility of the combo form
  const toggleFormVisibility = () => {
    if (showForm) {
      resetForm(); // Reset the form if it's currently visible and being hidden
    }
    setShowForm(!showForm); // Toggle the showForm state
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-lg text-gray-700">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error && !showForm) { // Display global errors, not just form errors
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Lỗi:</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <p className="mt-2 text-sm">Vui lòng kiểm tra kết nối máy chủ hoặc thử tải lại trang.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 font-sans min-h-screen bg-gray-50">
      {/* --- Header --- */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-800 mb-12 drop-shadow-lg tracking-tight">
        <span role="img" aria-label="package">📦</span> Quản Lý Combo Sản Phẩm
      </h1>

      {/* --- Toggle Form Button --- */}
      <div className="flex justify-center mb-12">
        <button
          onClick={toggleFormVisibility}
          className={`px-10 py-4 text-lg font-bold rounded-full transition-all duration-300 ease-in-out shadow-lg hover:scale-105 transform
            ${showForm
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white'
            } focus:outline-none focus:ring-4 focus:ring-indigo-300`}
        >
          {showForm ? '❌ Hủy tạo/chỉnh sửa' : '➕ Tạo Combo Mới'}
        </button>
      </div>

      {/* --- Combo Creation/Edit Form --- */}
      {showForm && (
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl mb-16 border border-indigo-100 max-w-4xl mx-auto animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            {editingComboId ? '🛠️ Chỉnh sửa Combo' : '✨ Tạo Combo Mới'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Lỗi:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {/* Form Fields Section */}
          <div className="space-y-8 mb-10 font-sans text-gray-800"> {/* Increased vertical spacing & dùng font sans-serif */}
            <div>
              <label
                htmlFor="comboName"
                className="block text-gray-700 text-sm font-semibold mb-3 tracking-wide leading-relaxed"
              >
                Tên Combo
              </label>
              <input
                id="comboName"
                type="text"
                placeholder="Ví dụ: Combo Tiết Kiệm, Combo Gia Đình"
                className="w-full px-5 py-3 border border-gray-300 rounded-2xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 ease-in-out"
                value={comboForm.name}
                onChange={(e) =>
                  setComboForm({ ...comboForm, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="comboPrice"
                className="block text-gray-700 text-sm font-semibold mb-3 tracking-wide leading-relaxed"
              >
                Giá Combo (VNĐ)
              </label>
              <input
                id="comboPrice"
                type="number"
                placeholder="Ví dụ: 150000"
                min="0"
                className="w-full px-5 py-3 border border-gray-300 rounded-2xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 ease-in-out"
                value={comboForm.price}
                onChange={(e) =>
                  setComboForm({ ...comboForm, price: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="comboImage"
                className="block text-gray-700 text-sm font-semibold mb-3 tracking-wide leading-relaxed"
              >
                Ảnh Combo (tùy chọn)
              </label>
              <input
                id="comboImage"
                type="file"
                accept="image/*"
                className="block w-full p-3 border border-gray-300 rounded-2xl shadow-sm bg-gray-50 cursor-pointer file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition duration-300 ease-in-out"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {imageFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Đã chọn:{" "}
                  <span className="font-semibold text-gray-800">
                    {imageFile.name}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Product List Section */}
          <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              🎯 Danh sách sản phẩm trong Combo
            </h3>
            <div className="space-y-5">
              {comboForm.items.length === 0 && (
                <p className="text-gray-500 italic text-center py-4">
                  Chưa có sản phẩm nào trong combo. Hãy thêm một sản phẩm!
                </p>
              )}
              {comboForm.items.map((item, idx) => (
                <div
                  key={idx}
                  className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-slide-in-right"
                >
                  <select
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700 w-full"
                    value={item.product_id}
                    onChange={(e) =>
                      updateProductItem(idx, "product_id", e.target.value)
                    }
                    required
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.length > 0 ? (
                      products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Không có sản phẩm nào</option>
                    )}
                  </select>

                  <select
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700 w-full"
                    value={item.size_id}
                    onChange={(e) =>
                      updateProductItem(idx, "size_id", e.target.value)
                    }
                    required
                  >
                    <option value="">Chọn size</option>
                    {sizes.length > 0 ? (
                      sizes.map((s) => (
                        <option key={s.masize} value={s.masize}>
                          {s.size}
                        </option>
                      ))
                    ) : (
                      <option disabled>Không có size nào</option>
                    )}
                  </select>

                  <input
                    type="number"
                    min={1}
                    placeholder="Số lượng"
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700 placeholder-gray-400 w-full"
                    value={item.quantity}
                    onChange={(e) =>
                      updateProductItem(
                        idx,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    required
                  />
                  <button
                    onClick={() => removeProductItem(idx)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                    title="Xóa sản phẩm này khỏi combo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addProductToCombo}
              className="mt-6 px-7 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:scale-105 transform font-semibold focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Thêm sản phẩm
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-12 w-full px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-full hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 shadow-xl hover:scale-105 transform focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            {editingComboId ? '💾 Lưu chỉnh sửa Combo' : '🚀 Tạo Combo Mới'}
          </button>
        </div>
      )}

      {/* --- Combo List as Table --- */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 overflow-x-auto">
        {combos.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <p className="text-xl font-semibold mb-4">Chưa có combo nào được tạo.</p>
            <p className="text-md">Hãy click vào "Tạo Combo Mới" để bắt đầu!</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide rounded-tl-lg"
                >
                  ID Combo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide"
                >
                  Ảnh
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"
                >
                  Tên Combo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide"
                >
                  Giá
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"
                >
                  Các sản phẩm trong Combo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide rounded-tr-lg"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {combos.map((combo) => (
                <tr
                  key={combo.id}
                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {combo.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"> {/* Centered image */}
                    <img
                      src={`/img/${combo.img}`}
                      alt={combo.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300 shadow-sm mx-auto hover:shadow-lg transition-shadow duration-300" /* mx-auto for centering */
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/64x64/E0E0E0/616161?text=No+Image";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {combo.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-bold text-right"> {/* Right-aligned price */}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(combo.price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                    {combo.items.length === 0 ? (
                      <span className="italic text-gray-400">
                        Không có sản phẩm
                      </span>
                    ) : (
                      <ul className="list-disc list-inside space-y-1 max-h-36 overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar */}
                        {combo.items.map((item, i) => {
                          const product = products.find(
                            (p) => p.id === item.product_id
                          );
                          const size = sizes.find(
                            (s) => s.masize === item.size_id
                          );
                          return (
                            <li key={i} className="text-xs">
                              <span className="font-semibold text-gray-700">
                                {product ? product.name : "Sản phẩm không rõ"}
                              </span>
                              {size && ` (${size.size})`} - SL: {item.quantity}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => handleEdit(combo)}
                        className="flex items-center gap-1 px-5 py-2 text-xs font-semibold rounded-md bg-yellow-500 hover:bg-yellow-600 text-white shadow-md transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        aria-label={`Sửa combo ${combo.name}`}
                      >
                        <span role="img" aria-hidden="true">
                          ✏️
                        </span>{" "}
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(combo.id)}
                        className="flex items-center gap-1 px-5 py-2 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-700 text-white shadow-md transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label={`Xoá combo ${combo.name}`}
                      >
                        <span role="img" aria-hidden="true">
                          🗑️
                        </span>{" "}
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ComboManager;