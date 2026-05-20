import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import API from "../api/axios";

function ManageSlots() {
  const [slots, setSlots] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    location: "",
    slotNumber: "",
    floor: "",
    vehicleType: "Four Wheeler",
    status: "Available",
    pricePerHour: "",
    totalSpaces: "",
    availableSpaces: "",
    image: null,
  });

  const fetchSlots = async () => {
    try {
      const res = await API.get("/slots");
      setSlots(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch slots");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];

      setFormData({
        ...formData,
        image: file,
      });

      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addSlot = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("location", formData.location);
      data.append("slotNumber", formData.slotNumber);
      data.append("floor", formData.floor);
      data.append("vehicleType", formData.vehicleType);
      data.append("status", formData.status);
      data.append("pricePerHour", formData.pricePerHour);
      data.append("totalSpaces", formData.totalSpaces || 1);
      data.append(
        "availableSpaces",
        formData.availableSpaces || formData.totalSpaces || 1
      );

      if (formData.image) {
        data.append("image", formData.image);
      }

      await API.post("/slots", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Parking location added successfully");

      setFormData({
        location: "",
        slotNumber: "",
        floor: "",
        vehicleType: "Four Wheeler",
        status: "Available",
        pricePerHour: "",
        totalSpaces: "",
        availableSpaces: "",
        image: null,
      });

      setImagePreview("");
      fetchSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add slot");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/slots/${id}`, { status });
      toast.success("Slot status updated");
      fetchSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const deleteSlot = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this parking location?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/slots/${id}`);
      toast.success("Parking location deleted successfully");
      fetchSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete slot");
    }
  };

  return (
    <DashboardLayout>
      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>Add Parking Location</h3>
            <p>
              Add location, area code, image, price, and available parking
              capacity.
            </p>
          </div>
        </div>

        <form className="slot-form" onSubmit={addSlot}>
          <input
            type="text"
            name="location"
            list="parking-locations"
            placeholder="Location Name e.g. City Center Mall Parking"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <datalist id="parking-locations">
            <option value="City Center Mall Parking" />
            <option value="Tech Park Basement Parking" />
            <option value="Railway Station Parking" />
            <option value="Airport Premium Parking" />
            <option value="Downtown Plaza Parking" />
            <option value="Hospital Visitor Parking" />
            <option value="Metro Station Parking" />
            <option value="Shopping Complex Parking" />
            <option value="University Campus Parking" />
            <option value="Office Tower Parking" />
          </datalist>

          <input
            type="text"
            name="slotNumber"
            placeholder="Slot / Area Code e.g. A-ZONE"
            value={formData.slotNumber}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="floor"
            placeholder="Floor e.g. Basement 1"
            value={formData.floor}
            onChange={handleChange}
            required
          />

          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
          >
            <option value="Two Wheeler">Two Wheeler</option>
            <option value="Four Wheeler">Four Wheeler</option>
          </select>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <input
            type="number"
            name="pricePerHour"
            placeholder="Price Per Hour"
            value={formData.pricePerHour}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="totalSpaces"
            placeholder="Total Spaces"
            value={formData.totalSpaces}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="availableSpaces"
            placeholder="Available Spaces"
            value={formData.availableSpaces}
            onChange={handleChange}
          />

          <div className="file-input-box">
            <label>Parking Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          {imagePreview && (
            <div className="preview-box">
              <img
                src={imagePreview}
                alt="Parking preview"
                className="slot-image-preview"
              />
              <p>Image selected</p>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Add Parking"}
          </button>
        </form>
      </section>

      <section className="content-card">
        <div className="section-header">
          <div>
            <h3>Manage Parking Locations</h3>
            <p>View, update status, and monitor parking availability.</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Location</th>
                <th>Area</th>
                <th>Floor</th>
                <th>Vehicle</th>
                <th>Price/hr</th>
                <th>Total</th>
                <th>Available</th>
                <th>Status</th>
                <th>Change Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id}>
                  <td>
                    <img
                      src={slot.image}
                      alt={slot.location}
                      className="table-slot-img"
                    />
                  </td>

                  <td>{slot.location}</td>
                  <td>{slot.slotNumber}</td>
                  <td>{slot.floor}</td>
                  <td>{slot.vehicleType}</td>
                  <td>₹{slot.pricePerHour}</td>
                  <td>{slot.totalSpaces}</td>
                  <td>{slot.availableSpaces}</td>

                  <td>
                    <StatusBadge value={slot.status} />
                  </td>

                  <td>
                    <select
                      value={slot.status}
                      onChange={(e) => updateStatus(slot._id, e.target.value)}
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="small-danger-btn"
                      onClick={() => deleteSlot(slot._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {slots.length === 0 && (
                <tr>
                  <td colSpan="11" className="empty-cell">
                    No parking locations found.
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

export default ManageSlots;
