import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import "../styles/dashboard.css";
const Dashboard = () => {

  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then(res => setData(res.data));
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="dashboard">

      {/* KPI CARDS */}
      <div className="cards">

        <div className="card">
          <h4>Total Customers</h4>
          <p>{data.totalCustomers}</p>
        </div>

        <div className="card">
          <h4>Total Orders</h4>
          <p>{data.totalOrders}</p>
        </div>

        <div className="card">
          <h4>Today's Orders</h4>
          <p>{data.todayOrders}</p>
        </div>

        <div className="card revenue">
          <h4>Today's Revenue</h4>
          <p>₹ {data.todayRevenue}</p>
        </div>

      </div>

      {/* SECOND ROW */}

      <div className="cards">

        <div className="card paid">
          <h4>Paid Orders</h4>
          <p>{data.paidOrders}</p>
        </div>

        <div className="card unpaid">
          <h4>Unpaid Orders</h4>
          <p>{data.unpaidOrders}</p>
        </div>

      </div>

      {/* CHART */}

      <div className="chart-box">
        <h3>Last 7 Days Orders</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.weeklyOrders}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3}/>
          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default Dashboard;