import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabase";
import data from "../data/data.json";
import "./Booking.css";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  // Can receive either a service or a package
  const selectedService = location.state?.service;
  const selectedPackage = location.state?.package;

  const [service, setService] = useState(selectedService || null);
  const [packageItem, setPackageItem] = useState(selectedPackage || null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Available time slots
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
  ];

  const today = new Date().toISOString().split("T")[0];

  // Get complete service information for package services
  const packageServices = packageItem
    ? packageItem.services
        .map((serviceName) =>
          data.services.find((item) => item.name === serviceName)
        )
        .filter(Boolean)
    : [];

  // Calculate total package duration
  const packageDuration = packageServices.reduce((total, item) => {
    return total + parseInt(item.duration, 10);
  }, 0);

  const handleBooking = async (e) => {
    e.preventDefault();

    setMessage("");

    // Validate service/package
    if (!service && !packageItem) {
      setMessage("Please select a service or package.");
      return;
    }

    // Validate date/time
    if (!date || !time) {
      setMessage("Please select date and time.");
      return;
    }

    setLoading(true);

    try {
      // ------------------------------------------------
      // CHECK LOGGED-IN USER
      // ------------------------------------------------
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("User error:", userError);
        throw userError;
      }

      if (!user) {
        navigate("/login");
        return;
      }

      console.log("Logged-in user:", user.id);

      // ------------------------------------------------
      // CHECK WHETHER SLOT IS ALREADY BOOKED
      // ------------------------------------------------
      const {
        data: existingBooking,
        error: checkError,
      } = await supabase
        .from("appointments")
        .select("id")
        .eq("appointment_date", date)
        .eq("appointment_time", time)
        .eq("status", "booked")
        .limit(1);

      if (checkError) {
        console.error("Slot check error:", checkError);
        throw checkError;
      }

      if (existingBooking && existingBooking.length > 0) {
        setMessage(
          "This time slot is already booked. Please choose another time."
        );
        setLoading(false);
        return;
      }

      // ------------------------------------------------
      // PACKAGE BOOKING
      // ------------------------------------------------
      if (packageItem) {
        console.log("Creating package booking...");
        console.log("Package:", packageItem.name);
        console.log("Price:", packageItem.price);
        console.log("Duration:", packageDuration);

        const {
          data: newBooking,
          error: bookingError,
        } = await supabase
          .from("appointments")
          .insert({
            user_id: user.id,
            service_name: packageItem.name,
            service_price: packageItem.price,
            service_duration: packageDuration,
            appointment_date: date,
            appointment_time: time,
            status: "booked",
          })
          .select()
          .single();

        if (bookingError) {
          console.error("PACKAGE BOOKING ERROR:", bookingError);
          throw bookingError;
        }

        console.log("PACKAGE BOOKING CREATED:", newBooking);

        setMessage("Package booking confirmed successfully! 🎉");
      }

      // ------------------------------------------------
      // INDIVIDUAL SERVICE BOOKING
      // ------------------------------------------------
      else if (service) {
        console.log("Creating service booking...");
        console.log("Service:", service.name);
        console.log("Price:", service.price);
        console.log("Duration:", service.duration);

        const {
          data: newBooking,
          error: bookingError,
        } = await supabase
          .from("appointments")
          .insert({
            user_id: user.id,
            service_name: service.name,
            service_price: service.price,
            service_duration: parseInt(service.duration, 10),
            appointment_date: date,
            appointment_time: time,
            status: "booked",
          })
          .select()
          .single();

        if (bookingError) {
          console.error("SERVICE BOOKING ERROR:", bookingError);
          throw bookingError;
        }

        console.log("SERVICE BOOKING CREATED:", newBooking);

        setMessage("Booking confirmed successfully! 🎉");
      }

      // Clear selected date/time
      setDate("");
      setTime("");

      // Go to dashboard after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("BOOKING ERROR:", error);

      setMessage(
        error?.message || "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // NO SERVICE OR PACKAGE SELECTED
  // ==================================================
  if (!service && !packageItem) {
    return (
      <div className="booking-page">
        <div className="booking-container">

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <div className="booking-header">
            <span>GENT'S GLOW</span>
            <h1>Book Your Appointment</h1>
            <p>Look Sharp. Feel Confident.</p>
          </div>

          {/* SERVICES */}
          <div className="service-selection">

            <h2>Select a Service</h2>

            <div className="booking-services">

              {data.services.map((item) => (
                <div
                  key={item.id}
                  className="booking-service-card"
                  onClick={() => setService(item)}
                >
                  <h3>{item.name}</h3>

                  <p>
                    ₹{item.price} · {item.duration}
                  </p>

                  <button type="button">
                    Select
                  </button>
                </div>
              ))}

            </div>
          </div>

          {/* PACKAGES */}
          <div className="service-selection">

            <h2>Select a Package</h2>

            <div className="booking-services">

              {data.packages.map((item) => (
                <div
                  key={item.id}
                  className="booking-service-card"
                  onClick={() => setPackageItem(item)}
                >
                  <h3>{item.name}</h3>

                  <p>
                    ₹{item.price}
                  </p>

                  <p>
                    {item.services.length} services included
                  </p>

                  <button type="button">
                    Select Package
                  </button>
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==================================================
  // BOOKING FORM
  // ==================================================
  return (
    <div className="booking-page">

      <div className="booking-container">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="booking-header">
          <span>GENT'S GLOW</span>
          <h1>Book Your Appointment</h1>
          <p>Look Sharp. Feel Confident.</p>
        </div>

        <div className="booking-card">

          {/* ==========================================
              PACKAGE DETAILS
          ========================================== */}
          {packageItem && (
            <div className="selected-service">

              <div>

                <span>Selected Package</span>

                <h2>{packageItem.name}</h2>

                <p>
                  Total Duration: {packageDuration} minutes
                </p>

                <div style={{ marginTop: "15px" }}>

                  <strong>Included Services:</strong>

                  <ul>
                    {packageServices.map((item) => (
                      <li key={item.id}>
                        {item.name} — {item.duration}
                      </li>
                    ))}
                  </ul>

                </div>

              </div>

              <strong>
                ₹{packageItem.price}
              </strong>

              <button
                type="button"
                onClick={() => {
                  setPackageItem(null);
                  setService(null);
                }}
              >
                Change
              </button>

            </div>
          )}

          {/* ==========================================
              INDIVIDUAL SERVICE DETAILS
          ========================================== */}
          {service && !packageItem && (
            <div className="selected-service">

              <div>

                <span>Selected Service</span>

                <h2>{service.name}</h2>

                <p>{service.duration}</p>

              </div>

              <strong>
                ₹{service.price}
              </strong>

              <button
                type="button"
                onClick={() => {
                  setService(null);
                  setPackageItem(null);
                }}
              >
                Change
              </button>

            </div>
          )}

          {/* ==========================================
              BOOKING FORM
          ========================================== */}
          <form onSubmit={handleBooking}>

            {/* DATE */}
            <div className="form-group">

              <label>Choose Date</label>

              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

            </div>

            {/* TIME */}
            <div className="form-group">

              <label>Choose Time</label>

              <div className="time-grid">

                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={
                      time === slot
                        ? "time-slot selected"
                        : "time-slot"
                    }
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </button>
                ))}

              </div>

            </div>

            {/* MESSAGE */}
            {message && (
              <div
                className={
                  message.includes("successfully")
                    ? "booking-message success"
                    : "booking-message error"
                }
              >
                {message}
              </div>
            )}

            {/* CONFIRM BUTTON */}
            <button
              className="confirm-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Booking..."
                : packageItem
                ? "Confirm Package Booking"
                : "Confirm Appointment"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Booking;