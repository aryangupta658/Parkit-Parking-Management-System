import DashboardLayout from "../layouts/DashboardLayout";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <DashboardLayout>
      <section className="content-card profile-card">
        <div className="large-avatar">{user?.name?.charAt(0)}</div>

        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
        <span>{user?.role}</span>
      </section>
    </DashboardLayout>
  );
}

export default Profile;
