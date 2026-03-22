import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../styles/customer.css";
import "../styles/mobile.css";

const CustomerOrdersPage = () => {

  const navigate = useNavigate();
  const { custId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [custId]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders/customer/${custId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3>Loading orders...</h3>;
  }

  return (
   <div className="customer-container">

  <button className="back-btn" onClick={() => navigate(-1)}>
    ← Back
  </button>

  <h2>Orders for Room: {custId}</h2>

      {orders.length === 0 ? (
        <p className="empty">No orders found</p>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.orderId}>
                    <td>{o.orderId}</td>
                    <td>{o.quantity}</td>
                    <td>{o.orderDate}</td>
                    <td>{o.status?.statusName}</td>
                    <td>{o.paymentMode?.mode || "-"}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="mobile-orders">

            {orders.map((o) => (

              <div key={o.orderId} className="order-card">

                <div className="card-row">
                  <span>Order ID</span>
                  <b>{o.orderId}</b>
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

                <div className="card-row">
                  <span>Payment</span>
                  <b>{o.paymentMode?.mode || "-"}</b>
                </div>

              </div>

            ))}

          </div>
        </>
      )}

    </div>
  );
};

export default CustomerOrdersPage;