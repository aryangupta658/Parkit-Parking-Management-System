import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import API from "../api/axios";

function UserDashboard() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my-bookings");
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const confirmed = bookings.filter(
    (booking) => booking.bookingStatus === "Confirmed"
  );

  const completed = bookings.filter(
    (booking) => booking.bookingStatus === "Completed"
  );

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "Paid"
  );

  const totalSpent = paidBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );

  return (
    <DashboardLayout>
      <div className="stats-grid">
        <StatCard title="Confirmed Bookings" value={confirmed.length} />
        <StatCard title="Completed Bookings" value={completed.length} />
        <StatCard title="Total Paid" value={`₹${totalSpent}`} />
        <StatCard title="Total Bookings" value={bookings.length} />
      </div>

      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>Upcoming Booking</h3>
            <p>Your next confirmed parking booking.</p>
          </div>
        </div>

        {confirmed.length === 0 ? (
          <p className="empty-text">No confirmed upcoming booking found.</p>
        ) : (
          confirmed.slice(0, 1).map((booking) => (
            <div className="upcoming-card" key={booking._id}>
              <img src={booking.slot?.image} alt="parking" />

              <div>
                <h3>{booking.slot?.location}</h3>
                <p>
                  Floor {booking.slot?.floor}, Spot {booking.slot?.slotNumber}
                </p>
                <p>{booking.vehicleNumber}</p>
                <p>
                  {new Date(booking.startTime).toLocaleString()} -{" "}
                  {new Date(booking.endTime).toLocaleTimeString()}
                </p>
              </div>

              <div className="price-box">
                <h4>₹{booking.totalAmount}</h4>
                <StatusBadge value={booking.paymentStatus} />
              </div>
            </div>
          ))
        )}
      </section>

      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>Recent Bookings</h3>
            <p>Your latest parking activity.</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Spot</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Booking</th>
                <th>Payment</th>
              </tr>
            </thead>

            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.slot?.location}</td>
                  <td>{booking.slot?.slotNumber}</td>
                  <td>{new Date(booking.startTime).toLocaleString()}</td>
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
                  <td colSpan="6" className="empty-cell">
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

export default UserDashboard;
