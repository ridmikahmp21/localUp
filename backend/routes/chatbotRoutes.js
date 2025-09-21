const express = require("express");

const router = express.Router();

const faqs = [
  { intent: "list_product", keywords: ["list", "sell", "add item"], response: "To list a product, go to your seller dashboard, click 'Add Product', and fill in the details." },
  { intent: "buy_product", keywords: ["buy", "purchase", "order"], response: "To buy a product, search for the item, add it to your cart, and proceed to checkout." },
  { intent: "payment_methods", keywords: ["payment", "pay", "card", "cash"], response: "We support credit/debit cards, bank transfers, and cash on delivery." },
  { intent: "track_order", keywords: ["track", "order status", "shipping"], response: "Go to your orders page and click 'Track Order' for live updates." },
  { intent: "refund_policy", keywords: ["refund", "return", "cancel"], response: "You can request a refund within 7 days of delivery, subject to our return policy." }
];

router.post("/chat", (req, res) => {
  const { message, context } = req.body;
  const lowerMsg = message.toLowerCase();

  let match = faqs.find(faq => faq.keywords.some(k => lowerMsg.includes(k)));

  if (!match) {
    return res.json({
      response: "Sorry, I didn’t understand that. Do you want to ask about listing, buying, payments, tracking, or refunds?",
      context
    });
  }

  return res.json({
    response: match.response,
    context: match.intent
  });
});

module.exports = router;
