import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import API from "../api/axios";

function Payments() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my-bookings");
      setBookings(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch payments");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "Paid"
  );

  const totalPaid = paidBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );

  const totalSpacesBooked = paidBookings.reduce(
    (sum, booking) => sum + (booking.slotsBooked || 1),
    0
  );

  const downloadInvoice = (booking) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    const slotsBooked = booking.slotsBooked || 1;
    const pricePerHour = booking.slot?.pricePerHour || 0;

    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>PARKit Invoice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 30px;
      color: #0f172a;
      background: #f8fafc;
    }

    .invoice {
      max-width: 760px;
      margin: auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 28px;
    }

    h1 {
      color: #2563eb;
      margin-bottom: 4px;
    }

    .muted {
      color: #64748b;
      margin-bottom: 24px;
    }

    .invoice-header {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 18px;
      margin-bottom: 20px;
    }

    .badge {
      display: inline-block;
      padding: 8px 14px;
      background: #dcfce7;
      color: #15803d;
      border-radius: 999px;
      font-weight: bold;
      margin-top: 8px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }

    td:first-child {
      color: #475569;
      width: 45%;
    }

    .summary {
      margin-top: 24px;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 18px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      color: #334155;
    }

    .summary-row.total {
      font-size: 22px;
      font-weight: bold;
      color: #2563eb;
      border-top: 1px solid #e5e7eb;
      padding-top: 14px;
      margin-top: 14px;
      margin-bottom: 0;
    }

    .footer {
      margin-top: 26px;
      color: #64748b;
      font-size: 13px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="invoice">
    <div class="invoice-header">
      <div>
        <h1>PARKit</h1>
        <p class="muted">Parking Booking Payment Invoice</p>
      </div>

      <div>
        <strong>Invoice Date</strong>
        <p>${new Date().toLocaleDateString()}</p>
        <span class="badge">PAID</span>
      </div>
    </div>

    <table>
      <tr>
        <td><strong>Customer Name</strong></td>
        <td>${user?.name || "User"}</td>
      </tr>

      <tr>
        <td><strong>Email</strong></td>
        <td>${user?.email || "-"}</td>
      </tr>

      <tr>
        <td><strong>Booking ID</strong></td>
        <td>${booking._id}</td>
      </tr>

      <tr>
        <td><strong>Payment ID</strong></td>
        <td>${booking.razorpayPaymentId || "-"}</td>
      </tr>

      <tr>
        <td><strong>Parking Location</strong></td>
        <td>${booking.slot?.location || "-"}</td>
      </tr>

      <tr>
        <td><strong>Slot / Area Code</strong></td>
        <td>${booking.slot?.slotNumber || "-"}</td>
      </tr>

      <tr>
        <td><strong>Vehicle Number</strong></td>
        <td>${booking.vehicleNumber}</td>
      </tr>

      <tr>
        <td><strong>Spaces Booked</strong></td>
        <td>${slotsBooked}</td>
      </tr>

      <tr>
        <td><strong>Start Time</strong></td>
        <td>${new Date(booking.startTime).toLocaleString()}</td>
      </tr>

      <tr>
        <td><strong>End Time</strong></td>
        <td>${new Date(booking.endTime).toLocaleString()}</td>
      </tr>

      <tr>
        <td><strong>Payment Method</strong></td>
        <td>${booking.paymentMethod || "Razorpay"}</td>
      </tr>
    </table>

    <div class="summary">
      <div class="summary-row">
        <span>No. of Slots</span>
        <strong>${slotsBooked}</strong>
      </div>

      <div class="summary-row">
        <span>Parking Hours</span>
        <strong>${hours}</strong>
      </div>

      <div class="summary-row">
        <span>Per Hour Parking Fee</span>
        <strong>₹${pricePerHour}</strong>
      </div>

      <div class="summary-row total">
        <span>Total Paid</span>
        <strong>₹${booking.totalAmount}</strong>
      </div>
    </div>

    <p class="footer">
      Thank you for using PARKit. This is a system generated invoice.
    </p>
  </div>
</body>
</html>
`;

    const blob = new Blob([invoiceHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `PARKit-Invoice-${booking._id}.html`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Paid Bookings</p>
          <h2>{paidBookings.length}</h2>
        </div>

        <div className="stat-card">
          <p>Total Amount Paid</p>
          <h2>₹{totalPaid}</h2>
        </div>

        <div className="stat-card">
          <p>Total Spaces Booked</p>
          <h2>{totalSpacesBooked}</h2>
        </div>

        <div className="stat-card">
          <p>Invoice</p>
          <h2>Available</h2>
        </div>
      </div>

      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>Payments & Invoices</h3>
            <p>View paid bookings and download payment invoices.</p>
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
                <th>Amount</th>
                <th>Payment ID</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>

            <tbody>
              {paidBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.slot?.location}</td>
                  <td>{booking.slot?.slotNumber}</td>
                  <td>{booking.slotsBooked || 1}</td>
                  <td>{booking.vehicleNumber}</td>
                  <td>₹{booking.totalAmount}</td>

                  <td>
                    <span className="payment-id">
                      {booking.razorpayPaymentId || "-"}
                    </span>
                  </td>

                  <td>
                    <StatusBadge value={booking.paymentStatus} />
                  </td>

                  <td>
                    <button
                      className="small-primary-btn"
                      onClick={() => downloadInvoice(booking)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}

              {paidBookings.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    No paid bookings found.
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

export default Payments;
