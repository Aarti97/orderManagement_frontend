import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import "../styles/orders.css";
import "../styles/mobile.css";

const UserOrdersPage = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING");

  // ✅ Safe user fetch
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const loginUserId = Number(user.id || localStorage.getItem("userId"));

  /* ================= LOAD USER ORDERS ================= */

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);
 const fetchOrders = async () => {
  try {
    const res = await api.get("/orders/today");

    const filteredOrders = res.data.filter(
      (o) =>
        o.assignedUser &&
        o.assignedUser.role?.toUpperCase() !== "ROLE_ADMIN"
    );

    setOrders(filteredOrders);
    setLoading(false);

  } catch (err) {
    console.error(err);
    toast.error("Failed to load orders");
    setLoading(false);
  }
};
  if (loading) return <h3>Loading...</h3>;
  /* ================= COUNT BY STATUS ================= */

  const countByStatus = (statusId) => {
    return orders.filter((o) => o.status?.statusId === statusId).length;
  };

  /* ================= FILTER BY TAB ================= */

  const filtered = orders.filter((o) => {
    if (activeTab === "PENDING") return o.status?.statusId === 1;
    if (activeTab === "PROCESS") return o.status?.statusId === 2;
    if (activeTab === "COMPLETED") return o.status?.statusId === 3;
    return false;
  });

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="customer-container">

      {/* HEADER */}
      <div className="customer-header">
        <h2>User Orders</h2>
       
      </div>

      {/* TABS */}
      <div className="tabs">
        {[
          { name: "PENDING", id: 1 },
          { name: "PROCESS", id: 2 },
          { name: "COMPLETED", id: 3 }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.name ? "active" : ""}`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
            <span className="badge">{countByStatus(tab.id)}</span>
          </button>
        ))}
      </div>

      {/* TABLE VIEW */}
      <div className="table-wrapper">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Qty</th>
              <th>Date</th>
              <th>Working By</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Orders Found
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.orderId}>
                  <td>{o.customer?.custId}</td>
                  <td>{o.quantity}</td>
                  <td>{o.orderDate}</td>
                  <td>{o.assignedUser?.username || "Not Assigned"}</td>
                  <td>{o.paymentMode?.mode || "UNPAID"}</td>
                  <td>{o.status?.statusName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="mobile-cards">
        {filtered.map((o) => (
          <div className="customer-card" key={o.orderId}>
            <p><strong>Customer:</strong> {o.customer?.custId}</p>
            <p><strong>Quantity:</strong> {o.quantity}</p>
            <p><strong>Date:</strong> {o.orderDate}</p>
            <p><strong>Working By:</strong> {o.assignedUser?.username || "Not Assigned"}</p>
            <p><strong>Payment:</strong> {o.paymentMode?.mode || "UNPAID"}</p>
            <p><strong>Status:</strong> {o.status?.statusName}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default UserOrdersPage;