
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Login with Supabase Auth
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

      if (error) {
        console.error("Login error:", error);

        if (error.message === "Invalid login credentials") {
          setError(
            "Invalid email or password. Please check your credentials."
          );
        } else {
          setError(error.message);
        }

        setLoading(false);
        return;
      }

      // Make sure we received the logged-in user
      if (!data?.user) {
        setError("Unable to identify the logged-in user.");
        setLoading(false);
        return;
      }

      console.log("Logged in user:", data.user);

      // Step 2: Check the user's profile
      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", data.user.id)
          .maybeSingle();

      if (profileError) {
        console.error("Profile check error:", profileError);

        // Logout because we could not verify the account type
        await supabase.auth.signOut();

        setError(
          "Unable to verify your account. Please try again."
        );

        setLoading(false);
        return;
      }

      // Step 3: Show success message
      setSuccess("Login successful! Redirecting...");

      // Step 4: Redirect according to account type
      setTimeout(() => {
        if (profile?.is_admin === true) {
          // ADMIN
          console.log("Admin account detected");
          navigate("/admin");
        } else {
          // CUSTOMER
          console.log("Customer account detected");
          navigate("/dashboard");
        }
      }, 800);

    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          GENT'S <span>GLOW</span>
        </div>

        <p className="auth-subtitle">
          Premium Men's Grooming
        </p>

        {/* Heading */}
        <h1>Welcome Back</h1>

        <p className="auth-description">
          Login to continue your grooming journey.
        </p>

        {/* Error */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register */}
        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>

        {/* Reset Password */}
        <p className="auth-switch">
          Forgot your password?{" "}
          <Link to="/reset-password">
            Reset Password
          </Link>
        </p>

        {/* Back Home */}
        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default Login;

