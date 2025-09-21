const Cart = require("../models/Cart");

const mergeDuplicateCarts = async (userId) => {
  const carts = await Cart.find({ user: userId });
  if (carts.length <= 1) return;

  const mergedItemsMap = new Map();

  carts.forEach((cart) => {
    cart.items.forEach(({ product, quantity }) => {
      const key = product.toString();
      mergedItemsMap.set(key, (mergedItemsMap.get(key) || 0) + quantity);
    });
  });

  const mergedItems = Array.from(mergedItemsMap.entries()).map(
    ([productId, quantity]) => ({ product: productId, quantity })
  );

  const primaryCart = carts[0];
  primaryCart.items = mergedItems;
  await primaryCart.save();

  const extraCartIds = carts.slice(1).map((c) => c._id);
  await Cart.deleteMany({ _id: { $in: extraCartIds } });
};

module.exports = mergeDuplicateCarts;
