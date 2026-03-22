import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Users from "./pages/Users";
import Layout from "./layout/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import CustomerOrdersPage from "./pages/CustomerOrdersPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute roles={["admin"]}>
            <Layout><AdminDashboard /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <PrivateRoute roles={["admin", "user"]}>
            <Layout><Orders /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <PrivateRoute roles={["admin"]}>
            <Layout><Customers /></Layout>
          </PrivateRoute>
        }
      />

      

      

        <Route
          path="/customers/:custId"
          element={<CustomerOrdersPage />}
        />

    
       <Route
        path="/users"
        element={
          <PrivateRoute roles={["admin"]}>
            <Layout><Users /></Layout>
          </PrivateRoute>
        }
      />

    </Routes>
  );
}

export default App;