
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/login");
        return;
      }

      setUser(user);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (profile) {
        setFullName(profile.full_name || "");
        setPhone(profile.phone || "");
      }
    } catch (err) {
      console.error("Profile loading error:", err);
      setError("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName.trim(),
          phone: phone.trim(),
        });

      if (updateError) {
        throw updateError;
      }

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-logo">
          GENT'S <span>GLOW</span>
        </div>

        <div className="profile-loading-spinner"></div>

        <p>Loading your profile...</p>
      </div>
    );
  }

  const avatarLetter = fullName
    ? fullName.trim().charAt(0).toUpperCase()
    : "G";

  return (
    <div className="profile-page">

      {/* ================= BACK BUTTON ================= */}

      <div className="profile-container">

        <button
          className="profile-back"
          onClick={() => navigate("/dashboard")}
        >
          <span>←</span>
          Back to Dashboard
        </button>


        {/* ================= HEADER ================= */}

        <div className="profile-header">

          <span className="profile-eyebrow">
            GENT'S GLOW
          </span>

          <h1>
            My <span>Profile</span>
          </h1>

          <p>
            Manage your personal information and account details.
          </p>

        </div>


        {/* ================= PROFILE CARD ================= */}

        <div className="profile-card">

          {/* PROFILE TOP */}

          <div className="profile-top">

            <div className="profile-avatar">
              {avatarLetter}
            </div>

            <div className="profile-identity">

              <h2>
                {fullName || "Gentleman"}
              </h2>

              <p>
                {user?.email}
              </p>

              <span className="profile-member">
                <span className="member-dot"></span>
                GENT'S GLOW MEMBER
              </span>

            </div>

          </div>


          {/* DIVIDER */}

          <div className="profile-divider"></div>


          {/* FORM */}

          <form onSubmit={handleSave}>

            {/* FULL NAME */}

            <div className="profile-form-group">

              <label htmlFor="fullName">
                Full Name
              </label>

              <div className="profile-input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="profile-form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="profile-input-wrapper">

                <span className="input-icon">
                  📱
                </span>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="profile-input-wrapper">

                <span className="input-icon">
                  ✉️
                </span>

                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                />

              </div>

              <small>
                Your email is managed by your account and cannot be changed
                here.
              </small>

            </div>


            {/* ERROR */}

            {error && (
              <div className="profile-message error">
                <span>!</span>
                {error}
              </div>
            )}


            {/* SUCCESS */}

            {message && (
              <div className="profile-message success">
                <span>✓</span>
                {message}
              </div>
            )}


            {/* SAVE */}

            <button
              type="submit"
              className="save-profile-button"
              disabled={saving}
            >

              {saving ? (
                <>
                  <span className="button-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  Save Changes
                  <span>→</span>
                </>
              )}

            </button>

          </form>

        </div>


        {/* ================= ACCOUNT INFO ================= */}

        <div className="profile-info-grid">

          <div className="profile-info-card">

            <div className="info-icon">
              🔒
            </div>

            <div>
              <h3>Account Security</h3>

              <p>
                Your account information is securely managed through
                Supabase authentication.
              </p>
            </div>

          </div>


          <div className="profile-info-card">

            <div className="info-icon">
              ✨
            </div>

            <div>
              <h3>Premium Experience</h3>

              <p>
                Manage your appointments and enjoy your grooming experience
                with GENT'S GLOW.
              </p>
            </div>

          </div>

        </div>


        {/* ================= FOOTER ================= */}

        <footer className="profile-footer">

          <div className="profile-footer-logo">
            GENT'S <span>GLOW</span>
          </div>

          <p>
            Look Sharp. Feel Confident.
          </p>

          <div className="profile-footer-links">

            <button onClick={() => navigate("/")}>
              Home
            </button>

            <button onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>

            <button onClick={() => navigate("/booking")}>
              Book Appointment
            </button>

            <button onClick={() => navigate("/bookings")}>
              My Bookings
            </button>

          </div>

          <div className="profile-footer-copy">
            © {new Date().getFullYear()} Gent's Glow. All rights reserved.
          </div>

        </footer>

      </div>

    </div>
  );
}

export default Profile;

