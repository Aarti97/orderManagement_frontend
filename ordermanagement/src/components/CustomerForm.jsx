import { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/customer.css";

const CustomerForm = ({ onClose, refresh, editData }) => {
  const [form, setForm] = useState({
    custId: "",
    building: "",
    roomNo: "",
    phoneNo: "",
    society: "",
    status: "active",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  useEffect(() => {
    if (!editData && form.building && form.roomNo) {
      setForm((prev) => ({
        ...prev,
        custId: `${prev.building}_${prev.roomNo}`,
      }));
    } else if (!editData) {
      setForm((prev) => ({
        ...prev,
        custId: "",
      }));
    }
  }, [form.building, form.roomNo, editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.custId) {
      setError("Building and Room No required.");
      return;
    }

    try {
      setLoading(true);

      if (editData) {
        await api.put(`/customers/${form.custId}`, form);
      } else {
        await api.post("/customers", form);
      }

      refresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h3 className="form-title">
          {editData ? "Edit Customer" : "Add Customer"}
        </h3>

        {error && <p className="error">{error}</p>}

        <div className="form-grid">
          <div className="input-group">
            <label>Customer ID</label>
            <input
              name="custId"
              disabled={editData}
              value={form.custId}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Building</label>
            <input
             disabled={editData}
              name="building"
              value={form.building}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Room No</label>
            <input
              name="roomNo"
              value={form.roomNo}
               disabled={editData}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input
              name="phoneNo"
              value={form.phoneNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Society</label>
            <input
              name="society"
               disabled={editData}
              value={form.society}
              onChange={handleChange}
            />
          </div>

          {editData && (
            <div className="input-group">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            type="submit"
            className="btn save-btn"
            disabled={loading || !form.building || !form.roomNo}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            className="btn cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;