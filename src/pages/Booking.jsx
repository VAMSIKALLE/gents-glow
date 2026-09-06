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
    "20:00"
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

  // Calculate package duration
  const packageDuration = packageServices.reduce((total, item) => {
    return total + parseInt(item.duration);
  }, 0);

  const handleBooking = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!service && !packageItem) {
      setMessage("Please select a service or package.");
      return;
    }

    if (!date || !time) {
      setMessage("Please select date and time.");
      return;
    }

    setLoading(true);

    try {
      // Check logged-in user
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/login");
        return;
      }

      // Check whether slot is already booked
      const {
        data: existingBooking,
        error: checkError
      } = await supabase
        .from("appointments")
        .select("id")
        .eq("appointment_date", date)
        .eq("appointment_time", time)
        .eq("status", "booked")
        .limit(1);

      if (checkError) {
        throw checkError;
      }

      if (existingBooking && existingBooking.length > 0) {
        setMessage(
          "This time slot is already booked. Please choose another time."
        );
        setLoading(false);
        return;
      }

      // PACKAGE BOOKING
      if (packageItem) {
        const { error } = await supabase
          .from("appointments")
          .insert({
            user_id: user.id,
            service_name: packageItem.name,
            service_price: packageItem.price,
            service_duration: packageDuration,
            appointment_date: date,
            appointment_time: time,
            status: "booked"
          });

        if (error) {
          throw error;
        }

        setMessage("Package booking confirmed successfully! 🎉");
      }

      // INDIVIDUAL SERVICE BOOKING
      else if (service) {
        const { error } = await supabase
          .from("appointments")
          .insert({
            user_id: user.id,
            service_name: service.name,
            service_price: service.price,
            service_duration: parseInt(service.duration),
            appointment_date: date,
            appointment_time: time,
            status: "booked"
          });

        if (error) {
          throw error;
        }

        setMessage("Booking confirmed successfully! 🎉");
      }

      setDate("");
      setTime("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (error) {
      console.error(error);
      setMessage(
        error.message || "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // No service/package selected
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

          {/* PACKAGE DETAILS */}
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
                onClick={() => setPackageItem(null)}
              >
                Change
              </button>

            </div>
          )}

          {/* INDIVIDUAL SERVICE DETAILS */}
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
                onClick={() => setService(null)}
              >
                Change
              </button>

            </div>
          )}

          <form onSubmit={handleBooking}>

            <div className="form-group">

              <label>Choose Date</label>

              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

            </div>

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