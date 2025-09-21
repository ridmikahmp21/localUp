export const loadPayHereScript = () => {
  return new Promise((resolve, reject) => {
    if (window.payhere) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load PayHere script"));
    document.head.appendChild(script);
  });
};

export const initializePayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    if (!window.payhere) {
      reject(new Error("PayHere script not loaded"));
      return;
    }

    // Set up callback functions
    window.payhere.onCompleted = function onCompleted(orderId) {
      resolve({ status: "completed", orderId });
    };

    window.payhere.onError = function onError(error) {
      reject(new Error(`Payment error: ${error}`));
    };

    window.payhere.onDismissed = function onDismissed() {
      resolve({ status: "dismissed" });
    };

    window.payhere.startPayment(paymentData);
  });
};



// Test Credit Cards for Sandbox:
// Card Number: 4242 4242 4242 4242
// Expiry Date: Any future date (e.g., 12/25)
// CVV: Any 3 digits (e.g., 123)
// Name: Any name