import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import API from "../api/axios";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    slotsBooked: 1,
    startTime: "",
    endTime: "",
    bookingStatus: "Pending",
    paymentStatus: "Pending",
  });

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/all-bookings");
      setBookings(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  };

  const startEdit = (booking) => {
    setEditingBooking(booking);

    setFormData({
      vehicleNumber: booking.vehicleNumber || "",
      slotsBooked: booking.slotsBooked || 1,
      startTime: formatDateForInput(booking.startTime),
      endTime: formatDateForInput(booking.endTime),
      bookingStatus: booking.bookingStatus || "Pending",
      paymentStatus: booking.paymentStatus || "Pending",
    });
  };

  const cancelEdit = () => {
    setEditingBooking(null);

    setFormData({
      vehicleNumber: "",
      slotsBooked: 1,
      startTime: "",
      endTime: "",
      bookingStatus: "Pending",
      paymentStatus: "Pending",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateBooking = async (e) => {
    e.preventDefault();

    if (!editingBooking) return;

    try {
      await API.put(`/bookings/admin/${editingBooking._id}`, formData);

      toast.success("Booking updated successfully");

      cancelEdit();
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update booking");
    }
  };

  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/bookings/admin/${id}`);
      toast.success("Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete booking");
    }
  };

  return (
    <DashboardLayout>
      {editingBooking && (
        <section className="content-card">
          <div className="section-header">
            <div>
              <h3>Edit Booking</h3>
              <p>
                Update booking details, spaces booked, booking status and
                payment status.
              </p>
            </div>
          </div>

          <form className="slot-form" onSubmit={updateBooking}>
            <input
              type="text"
              name="vehicleNumber"
              placeholder="Vehicle Number"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="slotsBooked"
              min="1"
              placeholder="No. of Slots"
              value={formData.slotsBooked}
              onChange={handleChange}
              required
            />

            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />

            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />

            <select
              name="bookingStatus"
              value={formData.bookingStatus}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>

            <button type="submit">Update Booking</button>

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
            <h3>All Bookings</h3>
            <p>Edit or delete customer bookings.</p>
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
                <th>Start</th>
                <th>End</th>
                <th>Amount</th>
                <th>Booking</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.user?.name}</td>
                  <td>{booking.slot?.location}</td>
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
                    <button
                      className="small-primary-btn"
                      onClick={() => startEdit(booking)}
                    >
                      Edit
                    </button>

                    <button
                      className="small-danger-btn"
                      onClick={() => deleteBooking(booking._id)}
                    >
                      Delete
                    </button>
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

export default AdminBookings;
