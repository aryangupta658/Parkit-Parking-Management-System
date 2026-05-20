import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  CalendarCheck,
  CreditCard,
  User,
  LogOut,
  Car,
  Users,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const userLinks = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Find Parking",
      path: "/find-parking",
      icon: <MapPin size={18} />,
    },
    {
      name: "My Bookings",
      path: "/my-bookings",
      icon: <CalendarCheck size={18} />,
    },
    {
      name: "Payments",
      path: "/payments",
      icon: <CreditCard size={18} />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User size={18} />,
    },
  ];

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Manage Slots",
      path: "/manage-slots",
      icon: <Car size={18} />,
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: <CalendarCheck size={18} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={18} />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <BarChart3 size={18} />,
    },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      <Link
        to={user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
        className="sidebar-logo"
      >
        <span>P</span>
        PARKit
      </Link>

      <div className="sidebar-links">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={isActive(link.path) ? "active" : ""}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>

      <button className="logout-btn" onClick={logout}>
        <LogOut size={18} />
        Log Out
      </button>
    </aside>
  );
}

export default Sidebar;
