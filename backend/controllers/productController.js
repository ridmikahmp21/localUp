const Product = require("../models/Product");

// Add product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category, status } = req.body;

    const image = req.files?.image?.[0]?.filename || null;
    const images = req.files?.images?.map((file) => file.filename) || [];

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      category,
      status,
      image,
      images,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category, sort } = req.query;

    const filter = category
      ? { category: { $regex: new RegExp(`^${category}$`, "i") } }
      : {};

    let sortOption = {};
    if (sort === "priceAsc") sortOption.price = 1;
    else if (sort === "priceDesc") sortOption.price = -1;
    else if (sort === "popular") sortOption.quantity = -1;
    else if (sort === "newest") sortOption.createdAt = -1;

    const products = await Product.find(filter).sort(sortOption);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.files?.image?.[0]) updates.image = req.files.image[0].filename;
    if (req.files?.images)
      updates.images = req.files.images.map((file) => file.filename);

    if (updates.price) updates.price = Number(updates.price);
    if (updates.quantity) updates.quantity = Number(updates.quantity);

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
