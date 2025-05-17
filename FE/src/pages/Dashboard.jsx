export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#fdfaf6] p-10 text-[#5c3d2e]">
            {/* Tiêu đề trang */}
            <div className="flex flex-col items-center text-center mb-12">
                <h1 className="text-5xl font-bold mb-3 flex items-center gap-4">
                    <span className="text-5xl">☕</span>
                    Cafe Admin
                    <span className="text-3xl text-[#a1866f] font-medium">Tổng quan</span>
                </h1>
                <p className="text-lg text-[#6e5345]">Chào mừng đến với hệ thống quản lý quán cà phê!</p>
            </div>

            {/* Nội dung chia 2 cột */}
            <div className="grid grid-cols-2 gap-8">
                {/* Box 1: Nhân viên */}
                <div className="bg-white p-8 rounded-2xl shadow-md border border-[#e9ded6] hover:shadow-lg transition duration-200">
                    <h2 className="text-2xl font-semibold mb-3 flex items-center justify-center gap-3">
                        <span className="text-2xl">👥</span> Nhân viên
                    </h2>
                    <p className="text-[#7b5e57] text-lg text-center">Quản lý thông tin, phân quyền và lịch làm việc.</p>
                </div>

                {/* Box 2: Sản phẩm */}
                <div className="bg-white p-8 rounded-2xl shadow-md border border-[#e9ded6] hover:shadow-lg transition duration-200">
                    <h2 className="text-2xl font-semibold mb-3 flex items-center justify-center gap-3">
                        <span className="text-2xl">🛒</span> Sản phẩm
                    </h2>
                    <p className="text-[#7b5e57] text-lg text-center">Theo dõi menu, giá cả và tồn kho sản phẩm.</p>
                </div>
            </div>
        </div>
    );
}
