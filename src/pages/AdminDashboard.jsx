import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import data from "../data/data.json";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ================================
  // LOAD APPOINTMENTS
  // ================================

  const loadAppointments = useCallback(async () => {
    setLoading(true);

    const { data: appointmentData, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (error) {
      console.error("Error loading appointments:", error);
      alert("Unable to load appointments.");
      setAppointments([]);
    } else {
      setAppointments(appointmentData || []);
    }

    setLoading(false);
  }, []);

  // ================================
  // CHECK ADMIN ACCESS
  // ================================

  const checkAdmin = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Admin check error:", error);
        alert("Unable to verify admin access.");
        navigate("/dashboard");
        return;
      }

      if (!profile || profile.is_admin !== true) {
        alert("Access denied. Admins only.");
        navigate("/dashboard");
        return;
      }

      setCheckingAdmin(false);

      await loadAppointments();
    } catch (error) {
      console.error("Admin authentication error:", error);
      navigate("/dashboard");
    }
  }, [loadAppointments, navigate]);

  useEffect(() => {
    void Promise.resolve().then(checkAdmin);
  }, [checkAdmin]);

  // ================================
  // UPDATE APPOINTMENT STATUS
  // ================================

  const updateStatus = async (id, status) => {
    setUpdatingId(id);

    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Status update error:", error);
      alert("Failed to update appointment.");
    } else {
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status }
            : appointment
        )
      );
    }

    setUpdatingId(null);
  };

  // ================================
  // LOGOUT
  // ================================

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // ================================
  // FORMAT DATE
  // ================================

  const formatDate = (date) => {
    if (!date) return "-";

    const formatted = new Date(`${date}T00:00:00`);

    return formatted.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ================================
  // FORMAT TIME
  // ================================

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ================================
  // GET PACKAGE INFORMATION
  // ================================

  const getPackageInfo = (appointment) => {
    return data.packages.find(
      (pkg) => pkg.name === appointment.service_name
    );
  };

  // ================================
  // STATISTICS
  // ================================

  const totalBookings = appointments.length;

  const bookedCount = appointments.filter(
    (appointment) => appointment.status === "booked"
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === "cancelled"
  ).length;

  const totalRevenue = appointments
    .filter((appointment) => appointment.status !== "cancelled")
    .reduce(
      (total, appointment) =>
        total + Number(appointment.service_price || 0),
      0
    );

  // ================================
  // LOADING ADMIN CHECK
  // ================================

  if (checkingAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-loading-screen">
          <div className="admin-loader"></div>
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // ================================
  // ADMIN PAGE
  // ================================

  return (
    <div className="admin-page">

      {/* ================================
          NAVBAR
      ================================= */}

      <nav className="admin-navbar">

        <div
          className="admin-logo"
          onClick={() => navigate("/admin")}
        >
          GENT'S <span>GLOW</span>
        </div>

        <div className="admin-nav-right">

          <button
            onClick={() => navigate("/dashboard")}
            className="customer-dashboard-btn"
          >
            Customer Dashboard
          </button>

          <button
            className="admin-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ================================
          HEADER
      ================================= */}

      <section className="admin-header">

        <div>

          <p className="admin-small-title">
            GENT'S GLOW MANAGEMENT
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage appointments, monitor bookings and track revenue.
          </p>

        </div>

      </section>

      {/* ================================
          STATISTICS
      ================================= */}

      <section className="admin-stats">

        <div className="admin-stat-card">

          <div className="stat-icon">
            📅
          </div>

          <span>
            Total Bookings
          </span>

          <strong>
            {totalBookings}
          </strong>

        </div>

        <div className="admin-stat-card">

          <div className="stat-icon">
            ⏳
          </div>

          <span>
            Active Bookings
          </span>

          <strong>
            {bookedCount}
          </strong>

        </div>

        <div className="admin-stat-card">

          <div className="stat-icon">
            ✓
          </div>

          <span>
            Completed
          </span>

          <strong>
            {completedCount}
          </strong>

        </div>

        <div className="admin-stat-card">

          <div className="stat-icon">
            ✕
          </div>

          <span>
            Cancelled
          </span>

          <strong>
            {cancelledCount}
          </strong>

        </div>

        <div className="admin-stat-card revenue-card">

          <div className="stat-icon">
            ₹
          </div>

          <span>
            Total Revenue
          </span>

          <strong>
            ₹{totalRevenue.toLocaleString("en-IN")}
          </strong>

        </div>

      </section>

      {/* ================================
          APPOINTMENTS
      ================================= */}

      <section className="admin-appointments">

        <div className="admin-section-heading">

          <div>

            <p className="admin-small-title">
              APPOINTMENT MANAGEMENT
            </p>

            <h2>
              All Appointments
            </h2>

          </div>

          <button
            className="refresh-btn"
            onClick={loadAppointments}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>

        </div>

        {/* ================================
            LOADING
        ================================= */}

        {loading ? (

          <div className="admin-empty">

            <div className="admin-loader"></div>

            <p>
              Loading appointments...
            </p>

          </div>

        ) : appointments.length === 0 ? (

          /* ================================
             EMPTY
          ================================= */

          <div className="admin-empty">

            <div className="empty-icon">
              📅
            </div>

            <h3>
              No appointments yet
            </h3>

            <p>
              Customer bookings will appear here.
            </p>

          </div>

        ) : (

          /* ================================
             TABLE
          ================================= */

          <div className="appointment-table-wrapper">

            <table className="appointment-table">

              <thead>

                <tr>
                  <th>Service / Package</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {appointments.map((appointment) => {

                  const packageInfo =
                    getPackageInfo(appointment);

                  return (

                    <tr key={appointment.id}>

                      {/* ================================
                          SERVICE / PACKAGE
                      ================================= */}

                      <td>

                        <div className="service-cell">

                          <strong>
                            {appointment.service_name}
                          </strong>

                          <small>
                            {appointment.service_duration} min
                          </small>

                          {/* PACKAGE */}

                          {packageInfo && (

                            <div
                              className="package-services"
                              style={{
                                marginTop: "8px"
                              }}
                            >

                              <span
                                style={{
                                  display: "block",
                                  fontWeight: "600",
                                  marginBottom: "4px"
                                }}
                              >
                                Package includes:
                              </span>

                              {packageInfo.services.map(
                                (serviceName) => (

                                  <small
                                    key={serviceName}
                                    style={{
                                      display: "block"
                                    }}
                                  >
                                    ✓ {serviceName}
                                  </small>

                                )
                              )}

                            </div>

                          )}

                        </div>

                      </td>

                      {/* ================================
                          DATE
                      ================================= */}

                      <td>
                        {formatDate(
                          appointment.appointment_date
                        )}
                      </td>

                      {/* ================================
                          TIME
                      ================================= */}

                      <td>
                        {formatTime(
                          appointment.appointment_time
                        )}
                      </td>

                      {/* ================================
                          PRICE
                      ================================= */}

                      <td className="price-cell">

                        ₹
                        {Number(
                          appointment.service_price || 0
                        ).toLocaleString("en-IN")}

                      </td>

                      {/* ================================
                          STATUS
                      ================================= */}

                      <td>

                        <span
                          className={`status-badge ${
                            appointment.status || "booked"
                          }`}
                        >
                          {appointment.status || "booked"}
                        </span>

                      </td>

                      {/* ================================
                          ACTION
                      ================================= */}

                      <td>

                        <div className="action-buttons">

                          {appointment.status === "booked" && (

                            <>

                              <button
                                className="complete-btn"
                                disabled={
                                  updatingId ===
                                  appointment.id
                                }
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    "completed"
                                  )
                                }
                              >
                                {updatingId ===
                                appointment.id
                                  ? "..."
                                  : "Complete"}
                              </button>

                              <button
                                className="cancel-btn"
                                disabled={
                                  updatingId ===
                                  appointment.id
                                }
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    "cancelled"
                                  )
                                }
                              >
                                Cancel
                              </button>

                            </>

                          )}

                          {appointment.status ===
                            "completed" && (

                            <span className="finished-text">
                              ✓ Completed
                            </span>

                          )}

                          {appointment.status ===
                            "cancelled" && (

                            <span className="cancelled-text">
                              Cancelled
                            </span>

                          )}

                        </div>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* ================================
          FOOTER
      ================================= */}

      <footer className="admin-footer">

        <p>
          © 2026 Gent's Glow. Admin Management Panel.
        </p>

      </footer>

    </div>
  );
}

export default AdminDashboard;