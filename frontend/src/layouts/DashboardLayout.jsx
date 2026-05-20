import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back, {user?.name}</p>
          </div>

          <div className="header-user">
            <div className="avatar">{user?.name?.charAt(0)}</div>

            <div>
              <h4>{user?.name}</h4>
              <span>{user?.role}</span>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
