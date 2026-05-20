import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import API from "../api/axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my-bookings");
      setBookings(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      await API.put(`/bookings/cancel/${id}`);
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <DashboardLayout>
      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>My Bookings</h3>
            <p>
              Track your parking bookings, booked spaces, and payment status.
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Parking</th>
                <th>Slot</th>
                <th>Spaces</th>
                <th>Vehicle</th>
                <th>Start</th>
                <th>End</th>
                <th>Amount</th>
                <th>Booking</th>
                <th>Payment</th>
                <th>Payment ID</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <div className="booking-location-cell">
                      <img
                        src={booking.slot?.image}
                        alt={booking.slot?.location}
                        className="mini-slot-img"
                      />
                      <span>{booking.slot?.location}</span>
                    </div>
                  </td>

                  <td>{booking.slot?.slotNumber}</td>
                  <td>{booking.slotsBooked || 1}</td>
                  <td>{booking.vehicleNumber}</td>
                  <td>{new Date(booking.startTime).toLocaleString()}</td>
                  <td>{new Date(booking.endTime).toLocaleString()}</td>
                  <td>₹{booking.totalAmount}</td>

                  <td>
                    <StatusBadge value={booking.bookingStatus} />
                  </td>

                  <td>
                    <StatusBadge value={booking.paymentStatus} />
                  </td>

                  <td>
                    {booking.razorpayPaymentId ? (
                      <span className="payment-id">
                        {booking.razorpayPaymentId}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {booking.bookingStatus !== "Cancelled" &&
                    booking.bookingStatus !== "Completed" ? (
                      <button
                        className="small-danger-btn"
                        onClick={() => cancelBooking(booking._id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan="11" className="empty-cell">
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

export default MyBookings;
