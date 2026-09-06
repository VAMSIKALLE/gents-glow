import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import "./MyBookings.css";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (error) {
        throw error;
      }

      setBookings(data || []);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void Promise.resolve().then(fetchBookings);
  }, [fetchBookings]);

  const cancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchBookings();
  };

  const formatDate = (date) => {
    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="bookings-loading">
          Loading your bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-page">

      <div className="bookings-container">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="bookings-header">
          <span>GENT'S GLOW</span>
          <h1>My Bookings</h1>
          <p>Your upcoming and previous appointments</p>
        </div>

        {message && (
          <div className="booking-error">
            {message}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="no-bookings">

            <div className="empty-icon">📅</div>

            <h2>No Bookings Yet</h2>

            <p>
              You haven't booked an appointment yet.
            </p>

            <button
              onClick={() => navigate("/booking")}
            >
              Book an Appointment
            </button>

          </div>
        ) : (
          <div className="bookings-list">

            {bookings.map((booking) => (
              <div
                className="booking-item"
                key={booking.id}
              >

                <div className="booking-service">
                  <span>Service</span>
                  <h2>{booking.service_name}</h2>
                </div>

                <div className="booking-detail">
                  <span>Date</span>
                  <strong>
                    {formatDate(booking.appointment_date)}
                  </strong>
                </div>

                <div className="booking-detail">
                  <span>Time</span>
                  <strong>
                    {formatTime(booking.appointment_time)}
                  </strong>
                </div>

                <div className="booking-detail">
                  <span>Price</span>
                  <strong className="price">
                    ₹{booking.service_price}
                  </strong>
                </div>

                <div className="booking-status">
                  <span className={booking.status}>
                    {booking.status}
                  </span>
                </div>

                {booking.status === "booked" && (
                  <button
                    className="cancel-button"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel
                  </button>
                )}

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default MyBookings;