require("dotenv").config({ path: "./.env" });
const admin = require("firebase-admin");
const serviceAccount = require("./ThongBaoFireBase.json"); // đường dẫn tới file bạn vừa tải

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


// Gửi thông báo đặt hàng
function sendOrderPlacedNotification(token) {
  const message = {
    notification: {
      title: "Đặt hàng thành công 🎉",
      body: "Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.",
    },
    token,
  };
  return admin.messaging().send(message);
}

// Gửi thông báo khi trạng thái đơn hàng thay đổi
function sendOrderStatusChangedNotification(token, status) {
  const statusMessages = {
    choxuly: "Đơn hàng của bạn đang chờ xử lý.",
    dangxuly: "Đơn hàng của bạn đang được xử lý.",
    hoantat: "Đơn hàng của bạn đã hoàn tất. Cảm ơn bạn! Vui Lòng Chờ bạn Nhé ",
    dahuy: "Đơn hàng của bạn đã bị hủy.",
  };

  const message = {
    notification: {
      title: "🔔 Cập nhật đơn hàng",
      body: statusMessages[status.toLowerCase()] || "Trạng thái đơn hàng đã thay đổi.",
    },
    token,
  };
  return admin.messaging().send(message);
}

module.exports = {
  sendOrderPlacedNotification,
  sendOrderStatusChangedNotification,
};


