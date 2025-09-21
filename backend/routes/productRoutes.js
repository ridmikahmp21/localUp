const express = require("express");
const { multipleImages } = require("../middleware/uploadMiddleware");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", multipleImages, addProduct);         // Create
router.get("/", getProducts);                         // Read all
router.get("/:id", getProductById);                   // Read one
router.put("/:id", multipleImages, updateProduct);    // Update
router.delete("/:id", deleteProduct);                 // Delete

module.exports = router;
