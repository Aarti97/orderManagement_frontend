import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import Select from "react-select";
import "../styles/orders.css";
import "../styles/mobile.css";
import noOrdersImg from "../assets/noorder.jpg";
import { FaWhatsapp } from "react-icons/fa";


const OrdersPage = () => {

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("PENDING");
  const [search, setSearch] = useState("");

  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(1);

  const loginUserId = Number(localStorage.getItem("userId"));
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role?.toUpperCase() || "";

  const paymentModes = [
    { id: 1, name: "UNPAID" },
    { id: 2, name: "CASH" },
    { id: 3, name: "GPAY" }
  ];

  const [form, setForm] = useState({
    custId: "",
    quantity: ""
  });

  /* ================= CUSTOMER OPTIONS ================= */

  const customerOptions = customers.map((c) => ({
    value: c.custId,
    label: c.custId
  }));

  /* ================= LOAD DATA ================= */

  useEffect(() => {

    fetchAll();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const fetchAll = async () => {

    await Promise.all([fetchOrders(), fetchCustomers()]);
    setLoading(false);

  };

  const fetchOrders = async () => {

    try {

      const res = await api.get("/orders/today");
      setOrders(res.data);

    } catch (err) {

      toast.error(err?.response?.data?.message || "Failed to load orders");

    }

  };

  const fetchCustomers = async () => {

    try {

      const res = await api.get("/customers");
      setCustomers(res.data);

    } catch (err) {

      toast.error(err?.response?.data?.message || "Failed to load customers");

    }

  };

  /* ================= ORDER COUNT ================= */

  const countByStatus = (statusId) => {

    if (role === "ADMIN")
      return orders.filter((o) => o.status?.statusId === statusId).length;

    if (statusId === 1)
      return orders.filter((o) => o.status?.statusId === 1).length;

    return orders.filter(
      (o) =>
        o.status?.statusId === statusId &&
        o.assignedUser?.id === loginUserId
    ).length;
  };

  /* ================= CREATE ORDER ================= */

  const createOrder = async () => {

    const customerId = form.custId;
    const quantity = Number(form.quantity);

    if (!customerId) {
      setError("Please select customer");
      return;
    }

    if (!quantity || quantity <= 0) {
      setError("Please enter quantity");
      return;
    }

    try {

      await api.post("/orders", {
        customerId,
        quantity
      });

      toast.success("Order created");

      setForm({
        custId: "",
        quantity: ""
      });

      setShowAddOrderModal(false);

      fetchOrders();

    } catch (err) {

      setError(err?.response?.data?.message || "Order already exists");

    }

  };

  /* ================= PROCESS ORDER ================= */

  const processOrder = async (id) => {

    try {

      setProcessingId(id);

      await api.patch(`/orders/${id}/status`);

      toast.success("Moved to PROCESS");

      fetchOrders();

    } catch {

      toast.error("Failed to process order");

    } finally {

      setProcessingId(null);

    }

  };

  /* ================= COMPLETE ORDER ================= */

  const openCompleteModal = (orderId) => {

    setSelectedOrderId(orderId);
    setSelectedPaymentMode(1);
    setCompleteModal(true);

  };

  const confirmCompleteOrder = async () => {

    try {

      await api.patch(`/orders/${selectedOrderId}/status`, {
        paymentModeId: selectedPaymentMode
      });

      toast.success("Order Completed");

      setCompleteModal(false);
      setSelectedOrderId(null);

      fetchOrders();

    } catch {

      toast.error("Failed to complete order");

    }

  };

  /* ================= WHATSAPP ================= */

  const sendWhatsApp = (o) => {

    const phone = o.customer?.phoneNo;
    const amount = (o.quantity || 0) * 40;

    const message =
`Hello ${o.customer?.custId},

Welcome to Shree Water Supply 💧

Your Order #${o.orderId} is UNPAID
Qty: ${o.quantity}
Amount: ₹${amount}

Scan & Pay:
https://i.postimg.cc/3wXyKxjx/scanner.jpg

Thank you 🙏`;

    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

  };

  /* ================= FILTER ================= */

  const tabFiltered = orders.filter((o) => {

    if (activeTab === "PENDING")
      return o.status?.statusId === 1;

   if (activeTab === "PROCESS") {
    return (
      o.status?.statusId === 2 &&
      o.assignedUser?.id === loginUserId
    );
  }
    if (activeTab === "COMPLETED")
      return role === "ADMIN"
        ? o.status?.statusId === 3
        : o.status?.statusId === 3 && o.assignedUser?.id === loginUserId;

    return false;

  });

  const filtered = tabFiltered.filter((o) =>
    (o.customer?.custId ?? "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <h3>Loading Orders...</h3>;

  return (

    <div className="order-container">

      {/* HEADER */}

      <div className="order-header">

        <h2>Today's Orders</h2>

        <div className="header-actions">

          <input
            placeholder="Search Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={() => setShowAddOrderModal(true)}>
            + Add Order
          </button>

        </div>

      </div>

      {/* TABS */}

      <div className="tabs">

        {[
          { name: "PENDING", id: 1 },
          { name: "PROCESS", id: 2 },
          { name: "COMPLETED", id: 3 }
        ].map((tab) => (

          <button
            key={tab.name}
            className={`tab-btn ${activeTab === tab.name ? "active" : ""}`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
            <span className="badge">{countByStatus(tab.id)}</span>
          </button>

        ))}

      </div>

      {/* TABLE */}

      <div className="table-wrapper">

      
        <table className="order-table">

          <thead>
            <tr>
              <th>Customer</th>
              <th>Qty</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filtered.length === 0 ? (
              <tr>
              <td colSpan="5" className="no-orders">

  <p>No Orders Found</p>
</td>
              </tr>
            ) : (

              filtered.map((o) => (

                <tr key={o.orderId}>

                  <td>{o.customer?.custId}</td>
                  <td>{o.quantity}</td>
                  <td>{o.orderDate}</td>
                  <td>{o.status?.statusName}</td>

                  <td>

                    {o.status?.statusId === 1 && (

                      <button
                        disabled={processingId === o.orderId}
                        onClick={() => processOrder(o.orderId)}
                      >
                        Process
                      </button>

                    )}

                    {o.status?.statusId === 2 && (

                      <button onClick={() => openCompleteModal(o.orderId)}>
                        Complete
                      </button>

                    )}

                    {o.status?.statusId === 3 &&
                      o.paymentMode?.id === 1 &&
                      role === "ADMIN" && (

                      <>
                        <button
                          className="wp-btn"
                          onClick={() => sendWhatsApp(o)}
                        >
                          <FaWhatsapp size={18}/>
                        </button>

                        <button onClick={() => openCompleteModal(o.orderId)}>
                          Pay
                        </button>
                      </>
                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>
      {/* MOBILE CARDS */}

<div className="mobile-orders">
 {filtered.length === 0 ? (
              <tr>
              <td colSpan="5" className="no-orders">
 
  <p>No Orders Found</p>
</td>
              </tr>
            ) : (

              
  filtered.map((o) => (

    <div key={o.orderId} className="order-card">

      <div className="card-row">
        <span>Customer</span>
        <b>{o.customer?.custId}</b>
      </div>

      <div className="card-row">
        <span>Quantity</span>
        <b>{o.quantity}</b>
      </div>

      <div className="card-row">
        <span>Date</span>
        <b>{o.orderDate}</b>
      </div>

      <div className="card-row">
        <span>Status</span>
        <b>{o.status?.statusName}</b>
      </div>

      <div className="card-actions">

        {o.status?.statusId === 1 && (
          <button
            disabled={processingId === o.orderId}
            onClick={() => processOrder(o.orderId)}
          >
            Process
          </button>
        )}

        {o.status?.statusId === 2 && (
          <button onClick={() => openCompleteModal(o.orderId)}>
            Complete
          </button>
        )}

        {o.status?.statusId === 3 &&
          o.paymentMode?.id === 1 &&
          role === "ADMIN" && (
          <>
            <button
              className="wp-btn"
              onClick={() => sendWhatsApp(o)}
            >
              <FaWhatsapp size={18}/>
            </button>

            <button onClick={() => openCompleteModal(o.orderId)}>
              Pay
            </button>
          </>
        )}

      </div>

    </div>

  )))}

</div>
 {/* ADD ORDER MODAL */}

      {showAddOrderModal && (

        <div className="modal">

          <div className="modal-content">

            <h3>Add Order</h3>

            {error && <p className="error">{error}</p>}

            <Select
              options={customerOptions}
              value={customerOptions.find(opt => opt.value === form.custId)}
              onChange={(selected) => {

                setForm({
                  ...form,
                  custId: selected ? selected.value : ""
                });

                setError("");

              }}
              placeholder="Select Customer"
              isClearable
            />

            <input
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => {

                setForm({
                  ...form,
                  quantity: e.target.value
                });

                setError("");

              }}
            />

            <div className="modal-actions">

              <button className="primary-btn" onClick={createOrder}>
                Save
              </button>

              <button className="secondary-btn" onClick={() => setShowAddOrderModal(false)}>
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

      {/* COMPLETE MODAL */}

      {completeModal && (

        <div className="modal">

          <div className="modal-content">

            <h3>Select Payment Mode</h3>

            <select
              value={selectedPaymentMode}
              onChange={(e) =>
                setSelectedPaymentMode(Number(e.target.value))
              }
            >

              {paymentModes.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.name}
                </option>
              ))}

            </select>

            <div className="modal-actions">

              <button className="primary-btn" onClick={confirmCompleteOrder}>
                Confirm
              </button>

              <button className="secondary-btn" onClick={() => setCompleteModal(false)}>
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default OrdersPage;