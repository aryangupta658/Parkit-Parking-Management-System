import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

function FindParking() {
  const [slots, setSlots] = useState([]);
  const [loadingSlotId, setLoadingSlotId] = useState(null);

  const [searchLocation, setSearchLocation] = useState("");

  const [bookingData, setBookingData] = useState({
    vehicleNumber: "",
    startTime: "",
    endTime: "",
    slotsBooked: 1,
  });

  const fetchSlots = async () => {
    try {
      const res = await API.get("/slots/available");
      setSlots(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch slots");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateAmountPreview = (pricePerHour) => {
    if (!bookingData.startTime || !bookingData.endTime) {
      return null;
    }

    const start = new Date(bookingData.startTime);
    const end = new Date(bookingData.endTime);

    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    const count = Number(bookingData.slotsBooked) || 1;

    if (hours <= 0 || count <= 0) {
      return null;
    }

    return {
      hours,
      count,
      pricePerHour,
      amount: hours * pricePerHour * count,
    };
  };

  const handlePayment = async (booking) => {
    const orderRes = await API.post("/bookings/create-order", {
      bookingId: booking._id,
    });

    const { order, key } = orderRes.data;
    const user = JSON.parse(localStorage.getItem("user"));

    const options = {
      key,
      amount: order.amount,
      currency: order.currency,
      name: "PARKit",
      description: "Parking Slot Booking Payment",
      order_id: order.id,

      handler: async function (response) {
        try {
          const verifyRes = await API.post("/bookings/verify-payment", {
            bookingId: booking._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          toast.success(verifyRes.data.message);

          setBookingData({
            vehicleNumber: "",
            startTime: "",
            endTime: "",
            slotsBooked: 1,
          });

          fetchSlots();
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Payment verification failed"
          );
        }
      },

      modal: {
        ondismiss: async function () {
          try {
            await API.put(`/bookings/cancel/${booking._id}`);
            toast.error("Payment cancelled. Booking removed.");
            fetchSlots();
          } catch (error) {
            toast.error("Payment popup closed.");
          }
        },
      },

      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },

      notes: {
        bookingId: booking._id,
        vehicleNumber: booking.vehicleNumber,
      },

      theme: {
        color: "#2563eb",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const bookSlot = async (slot) => {
    if (
      !bookingData.vehicleNumber ||
      !bookingData.startTime ||
      !bookingData.endTime
    ) {
      toast.error("Please enter vehicle number, start time and end time");
      return;
    }

    const requestedSlots = Number(bookingData.slotsBooked) || 1;

    if (requestedSlots <= 0) {
      toast.error("Number of slots must be at least 1");
      return;
    }

    if (requestedSlots > slot.availableSpaces) {
      toast.error(`Only ${slot.availableSpaces} spaces available`);
      return;
    }

    const start = new Date(bookingData.startTime);
    const end = new Date(bookingData.endTime);

    if (end <= start) {
      toast.error("End time must be greater than start time");
      return;
    }

    try {
      setLoadingSlotId(slot._id);

      const bookingRes = await API.post("/bookings", {
        slotId: slot._id,
        vehicleNumber: bookingData.vehicleNumber,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        slotsBooked: requestedSlots,
      });

      const booking = bookingRes.data.booking;

      await handlePayment(booking);
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoadingSlotId(null);
    }
  };

  const filteredSlots = slots.filter((slot) =>
    slot.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Search Section */}
      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>Search Parking Location</h3>
            <p>
              Find parking areas by location before entering booking details.
            </p>
          </div>
        </div>

        <div className="booking-form-row">
          <div className="input-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by location e.g. mall, airport, tech park"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Booking Details Section */}
      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>Booking Details</h3>
            <p>Enter vehicle number, number of slots, and parking time.</p>
          </div>
        </div>

        <div className="booking-form-row">
          <input
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number e.g. GJ-12-AB-1234"
            value={bookingData.vehicleNumber}
            onChange={handleChange}
          />

          <input
            type="number"
            name="slotsBooked"
            min="1"
            placeholder="No. of Slots"
            value={bookingData.slotsBooked}
            onChange={handleChange}
          />

          <input
            type="datetime-local"
            name="startTime"
            value={bookingData.startTime}
            onChange={handleChange}
          />

          <input
            type="datetime-local"
            name="endTime"
            value={bookingData.endTime}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Parking Cards */}
      <div className="parking-grid">
        {filteredSlots.map((slot) => {
          const preview = calculateAmountPreview(slot.pricePerHour);

          return (
            <div className="parking-slot-card" key={slot._id}>
              <img src={slot.image} alt={slot.location} />

              <div className="slot-info">
                <div className="slot-title-row">
                  <div>
                    <h3>{slot.location}</h3>
                    <p>
                      Floor {slot.floor}, Area {slot.slotNumber}
                    </p>
                    <p>
                      Available Spaces: {slot.availableSpaces}/
                      {slot.totalSpaces}
                    </p>
                  </div>

                  <span className="vehicle-pill">{slot.vehicleType}</span>
                </div>

                <div className="price-line">
                  <h4>₹{slot.pricePerHour}/hr</h4>

                  {preview && (
                    <p>
                      Fee Summary: {preview.count} slot × {preview.hours} hr × ₹
                      {preview.pricePerHour} ={" "}
                      <strong>₹{preview.amount}</strong>
                    </p>
                  )}
                </div>

                <button
                  className="pay-btn"
                  onClick={() => bookSlot(slot)}
                  disabled={loadingSlotId === slot._id}
                >
                  {loadingSlotId === slot._id ? "Processing..." : "Book & Pay"}
                </button>
              </div>
            </div>
          );
        })}

        {filteredSlots.length === 0 && (
          <div className="empty-card">
            <h3>No parking found</h3>
            <p>Try searching another location or check again later.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default FindParking;
