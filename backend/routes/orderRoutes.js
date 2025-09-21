const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  handlePaymentNotification,
  mockPayment,
  mockCreateAndPay,
  getAllOrders,
  createReview,
} = require("../controllers/orderController");

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.post("/mock-create", mockCreateAndPay);
router.get("/", getOrders);
router.get("/all", getAllOrders); 
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.post("/:id/mock-payment", mockPayment);
router.post("/payhere/notify", handlePaymentNotification);
router.post("/reviews", createReview);

module.exports = router;
