import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/layout.css";

const Layout = ({ children }) => (
  <div className="layout">
    <Sidebar />
    <div className="main">
      <Header />
      {children}
    </div>
  </div>
);

export default Layout;