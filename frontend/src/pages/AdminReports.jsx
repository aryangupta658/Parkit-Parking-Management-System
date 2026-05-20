import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
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

function AdminReports() {
  const [report, setReport] = useState(null);

  const fetchReports = async () => {
    try {
      const res = await API.get("/admin/reports");
      setReport(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (!report) {
    return (
      <DashboardLayout>
        <section className="content-card">
          <p className="empty-text">Loading reports...</p>
        </section>
      </DashboardLayout>
    );
  }

  const bookingColors = ["#f59e0b", "#2563eb", "#22c55e", "#ef4444"];
  const paymentColors = ["#22c55e", "#f59e0b", "#ef4444", "#991b1b"];
  const spaceColors = ["#22c55e", "#2563eb", "#ef4444"];

  const bookingStatusData = report.bookingStatusData.filter(
    (item) => item.value > 0
  );

  const paymentStatusData = report.paymentStatusData.filter(
    (item) => item.value > 0
  );

  const spaceStatusData = report.spaceStatusData.filter(
    (item) => item.value > 0
  );

  return (
    <DashboardLayout>
      <div className="stats-grid">
        <StatCard title="Total Revenue" value={`₹${report.totalRevenue}`} />
        <StatCard title="Total Bookings" value={report.totalBookings} />
        <StatCard title="Paid Bookings" value={report.paidBookings} />
        <StatCard title="Cancelled" value={report.cancelledBookings} />
      </div>

      <div className="stats-grid">
        <StatCard title="Total Users" value={report.totalUsers} />
        <StatCard title="Customers" value={report.totalCustomers} />
        <StatCard title="Total Spaces" value={report.totalSpaces} />
        <StatCard title="Available Spaces" value={report.availableSpaces} />
      </div>

      <div className="admin-grid">
        <section className="content-card">
          <div className="section-header">
            <div>
              <h3>Booking Status Report</h3>
              <p>Pending, confirmed, completed and cancelled bookings.</p>
            </div>
          </div>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bookingStatusData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <h3>Payment Status</h3>
              <p>Paid, pending, refunded and failed payments.</p>
            </div>
          </div>

          <div className="pie-wrapper">
            <ResponsiveContainer width="55%" height={260}>
              <PieChart>
                <Pie data={paymentStatusData} dataKey="value" outerRadius={90}>
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={entry.name} fill={paymentColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="legend-list">
              {paymentStatusData.map((item, index) => (
                <p key={item.name}>
                  <span style={{ background: paymentColors[index] }}></span>
                  {item.name}: {item.value}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="admin-grid">
        <section className="content-card">
          <div className="section-header">
            <div>
              <h3>Parking Space Report</h3>
              <p>Available, booked and maintenance spaces.</p>
            </div>
          </div>

          <div className="pie-wrapper">
            <ResponsiveContainer width="55%" height={260}>
              <PieChart>
                <Pie data={spaceStatusData} dataKey="value" outerRadius={90}>
                  {spaceStatusData.map((entry, index) => (
                    <Cell key={entry.name} fill={spaceColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="legend-list">
              {spaceStatusData.map((item, index) => (
                <p key={item.name}>
                  <span style={{ background: spaceColors[index] }}></span>
                  {item.name}: {item.value}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <h3>Revenue By Location</h3>
              <p>Paid revenue generated from each parking location.</p>
            </div>
          </div>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={report.revenueByLocation}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>Recent Bookings Report</h3>
            <p>Latest booking and payment activity.</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Parking</th>
                <th>Vehicle</th>
                <th>Spaces</th>
                <th>Amount</th>
                <th>Booking</th>
                <th>Payment</th>
              </tr>
            </thead>

            <tbody>
              {report.recentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.user?.name}</td>
                  <td>{booking.slot?.location}</td>
                  <td>{booking.vehicleNumber}</td>
                  <td>{booking.slotsBooked || 1}</td>
                  <td>₹{booking.totalAmount}</td>
                  <td>
                    <StatusBadge value={booking.bookingStatus} />
                  </td>
                  <td>
                    <StatusBadge value={booking.paymentStatus} />
                  </td>
                </tr>
              ))}

              {report.recentBookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-cell">
                    No report data found.
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

export default AdminReports;
