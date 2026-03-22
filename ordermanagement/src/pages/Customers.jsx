import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CustomerForm from "../components/CustomerForm";
import "../styles/customer.css";
import "../styles/orders.css";
const CustomerPage = () => {


  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  // Search filter
  const filtered = customers.filter(
    (c) =>
      c.phoneNo?.toLowerCase().includes(search.toLowerCase()) ||
      c.custId?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const indexOfLast = currentPage * perPage;
  const currentCustomers = filtered.slice(indexOfLast - perPage, indexOfLast);

  return (
    <div className="customer-container">

      {/* Header */}
      <div className="customer-header">
        <h2>Customers</h2>

        <div className="header-actions">
          <input
            placeholder="Search by Phone or Customer ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => {
              setShowForm(true);
              setEditData(null);
            }}
          >
             Add Customer
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="table-wrapper">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Phone</th>
              <th>Society</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentCustomers.map((c) => (
              <tr key={c.custId}>
                 <td>
        <a href={`/customers/${c.custId}`}>
        {c.custId}
        </a>
      </td>
               
                <td>{c.phoneNo}</td>
                <td>{c.society}</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditData(c);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>

                 

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="empty">No customers found</div>
      )}

      {/* Mobile Cards */}
      <div className="mobile-cards">
        {currentCustomers.map((c) => (
          <div className="customer-card" key={c.custId}>

            <p><strong>ID:</strong>  <a href={`/customers/${c.custId}`}>{c.custId}</a></p>
            <p><strong>Phone:</strong> {c.phoneNo}</p>
            <p><strong>Society:</strong> {c.society}</p>

            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>

              <button
                className="edit-btn"
                onClick={() => {
                  setEditData(c);
                  setShowForm(true);
                }}
              >
                Edit
              </button>

           

            </div>

          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filtered.length / perPage) },
          (_, i) => {
            const pageNumber = i + 1;

            return (
              <button
                key={`page-${pageNumber}`}
                onClick={() => setCurrentPage(pageNumber)}
                className={currentPage === pageNumber ? "active-page" : ""}
              >
                {pageNumber}
              </button>
            );
          }
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <CustomerForm
          editData={editData}
          onClose={() => setShowForm(false)}
          refresh={fetchCustomers}
        />
      )}

    </div>
  );
};

export default CustomerPage;