import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import API from "../api/axios";

function AdminDashboard() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const fetchData = async () => {
    try {
      const slotRes = await API.get("/slots");
      const bookingRes = await API.get("/bookings/all-bookings");

      setSlots(slotRes.data);
      setBookings(bookingRes.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalSpaces = slots.reduce(
    (sum, slot) => sum + (slot.totalSpaces || 0),
    0
  );

  const availableSpaces = slots.reduce(
    (sum, slot) => sum + (slot.availableSpaces || 0),
    0
  );

  const maintenanceSpaces = slots
    .filter((slot) => slot.status === "Maintenance")
    .reduce((sum, slot) => sum + (slot.totalSpaces || 0), 0);

  const bookedSpaces = Math.max(
    totalSpaces - availableSpaces - maintenanceSpaces,
    0
  );

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "Paid"
  );

  const totalRevenue = paidBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );

  const chartData = [
    { name: "Mon", bookings: 5 },
    { name: "Tue", bookings: 9 },
    { name: "Wed", bookings: 7 },
    { name: "Thu", bookings: 12 },
    { name: "Fri", bookings: 10 },
    { name: "Sat", bookings: 15 },
    { name: "Sun", bookings: 11 },
  ];

  const pieData = [
    { name: "Available", value: availableSpaces },
    { name: "Booked", value: bookedSpaces },
    { name: "Maintenance", value: maintenanceSpaces },
  ].filter((item) => item.value > 0);

  const colors = ["#22c55e", "#2563eb", "#ef4444"];

  return (
    <DashboardLayout>
      <div className="stats-grid">
        <StatCard title="Total Spaces" value={totalSpaces} />
        <StatCard title="Available Spaces" value={availableSpaces} />
        <StatCard title="Total Bookings" value={bookings.length} />
        <StatCard title="Paid Revenue" value={`₹${totalRevenue}`} />
      </div>

      <div className="admin-grid">
        <section className="content-card">
          <div className="section-header">
            <div>
              <h3>Booking Overview</h3>
              <p>Weekly booking trend.</p>
            </div>
          </div>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <h3>Recent Payments</h3>
              <p>Latest paid or pending bookings.</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Slot</th>
                  <th>Spaces</th>
                  <th>Amount</th>
                  <th>Payment</th>
                </tr>
              </thead>

              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.user?.name}</td>
                    <td>{booking.slot?.slotNumber}</td>
                    <td>{booking.slotsBooked}</td>
                    <td>₹{booking.totalAmount}</td>
                    <td>
                      <StatusBadge value={booking.paymentStatus} />
                    </td>
                  </tr>
                ))}

                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>Spot Status</h3>
            <p>Live parking space distribution.</p>
          </div>
        </div>

        <div className="pie-wrapper">
          <ResponsiveContainer width="45%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={90}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="legend-list">
            {pieData.map((item, index) => (
              <p key={item.name}>
                <span style={{ background: colors[index] }}></span>
                {item.name}: {item.value}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>Recent Bookings</h3>
            <p>Use the Bookings page to edit or delete bookings.</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Parking</th>
                <th>Slot</th>
                <th>Spaces</th>
                <th>Vehicle</th>
                <th>Amount</th>
                <th>Booking</th>
                <th>Payment</th>
              </tr>
            </thead>

            <tbody>
              {bookings.slice(0, 8).map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.user?.name}</td>
                  <td>{booking.slot?.location}</td>
                  <td>{booking.slot?.slotNumber}</td>
                  <td>{booking.slotsBooked}</td>
                  <td>{booking.vehicleNumber}</td>
                  <td>₹{booking.totalAmount}</td>

                  <td>
                    <StatusBadge value={booking.bookingStatus} />
                  </td>

                  <td>
                    <StatusBadge value={booking.paymentStatus} />
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    No bookings found.
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

export default AdminDashboard;
