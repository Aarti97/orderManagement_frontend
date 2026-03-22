import React from "react";

const WhatsAppButton = ({ order }) => {

  const phoneNumber = "918976377952"; // 👉 Put admin WhatsApp number (with country code)

  const message = `
Hello ${order.customerName},

Welcome to Shree Water Supply 💧

Your Order #${order.id} is UNPAID
Qty: ${order.quantity}
Amount: ₹${order.amount}

Scan & Pay:
https://i.postimg.cc/3wXyKxjx/scanner.jpg

Once payment is done, kindly share the screenshot.

Thank you for your support 🙏
`;

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  return (
    <button onClick={handleClick} className="wp-btn">
      💬 Send on WhatsApp
    </button>
  );
};

export default WhatsAppButton;