import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import API from "../api/axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const customers = users.filter((user) => user.role === "user");
  const admins = users.filter((user) => user.role === "admin");

  const startEdit = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      role: "user",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateUser = async (e) => {
    e.preventDefault();

    if (!editingUser) return;

    try {
      await API.put(`/admin/users/${editingUser._id}`, formData);

      toast.success("User updated successfully");

      cancelEdit();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/users/${id}`);

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <DashboardLayout>
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Users</p>
          <h2>{users.length}</h2>
        </div>

        <div className="stat-card">
          <p>Customers</p>
          <h2>{customers.length}</h2>
        </div>

        <div className="stat-card">
          <p>Admins</p>
          <h2>{admins.length}</h2>
        </div>

        <div className="stat-card">
          <p>Status</p>
          <h2>Active</h2>
        </div>
      </div>

      {editingUser && (
        <section className="content-card">
          <div className="section-header">
            <div>
              <h3>Edit User</h3>
              <p>Update user name, email and role.</p>
            </div>
          </div>

          <form className="slot-form" onSubmit={updateUser}>
            <input
              type="text"
              name="name"
              placeholder="User Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="User Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit">Update User</button>

            <button
              type="button"
              className="small-danger-btn"
              onClick={cancelEdit}
            >
              Cancel Edit
            </button>
          </form>
        </section>
      )}

      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>Users</h3>
            <p>View, edit and delete registered users.</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined On</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td>
                    <StatusBadge value={user.role} />
                  </td>

                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                  <td>
                    <button
                      className="small-primary-btn"
                      onClick={() => startEdit(user)}
                    >
                      Edit
                    </button>

                    <button
                      className="small-danger-btn"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-cell">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default AdminUsers;
