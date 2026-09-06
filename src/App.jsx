import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import data from "./data/data.json";

import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";


/* =========================================
   HOME PAGE
========================================= */

function Home() {
  const navigate = useNavigate();

  const handleBookService = (service) => {
    navigate("/booking", {
      state: {
        service: service
      }
    });
  };

  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div
          className="logo"
          onClick={() => navigate("/")}
        >
          GENT'S <span>GLOW</span>
        </div>

        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#services">
            Services
          </a>

          <a href="#packages">
            Packages
          </a>

          <a href="#about">
            About
          </a>

        </div>

        <div className="auth-buttons">

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <span className="hero-small">
            PREMIUM MEN'S GROOMING
          </span>

          <h1>
            Look Sharp.
            <br />
            <span>Feel Confident.</span>
          </h1>

          <p>
            Experience premium grooming services designed
            for the modern gentleman. From precision haircuts
            to luxurious grooming treatments.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/booking")}
            >
              Book Appointment
              <span> →</span>
            </button>

            <a
              href="#services"
              className="secondary-btn"
            >
              Explore Services
            </a>

          </div>

        </div>

      </section>


      {/* ================= SERVICES ================= */}

      <section
        className="services-section"
        id="services"
      >

        <div className="section-heading">

          <p className="section-label">
            WHAT WE OFFER
          </p>

          <h2>
            Premium Grooming
          </h2>

          <span>
            Professional services for the modern gentleman.
          </span>

        </div>


        <div className="services-grid">

          {data.services.map((service) => (

            <div
              className="service-card"
              key={service.id}
            >

              {/* SERVICE IMAGE */}

              <div className="service-image-wrapper">

                <img
                  src={service.image}
                  alt={service.name}
                  className="service-image"
                  loading="lazy"
                />

                <div className="service-image-overlay">

                  <span>
                    {service.category}
                  </span>

                </div>

              </div>


              {/* SERVICE CONTENT */}

              <div className="service-card-content">

                <div className="service-top">

                  <span className="service-number">
                    {String(service.id).padStart(2, "0")}
                  </span>

                  <span className="category">
                    {service.category}
                  </span>

                </div>

                <h3>
                  {service.name}
                </h3>

                <p>
                  {service.description}
                </p>


                <div className="service-bottom">

                  <strong>
                    ₹{service.price}
                  </strong>

                  <span>
                    ⏱ {service.duration}
                  </span>

                </div>


                <button
                  className="book-btn"
                  onClick={() => handleBookService(service)}
                >
                  Book Now
                  <span> →</span>
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ================= PACKAGES ================= */}

      <section
        className="packages-section"
        id="packages"
      >

        <div className="section-heading">

          <p className="section-label">
            EXCLUSIVE PACKAGES
          </p>

          <h2>
            Grooming Packages
          </h2>

          <span>
            Complete grooming experiences at special prices.
          </span>

        </div>


        <div className="packages-grid">

          {data.packages.map((pkg) => (

            <div
              className="package-card"
              key={pkg.id}
            >

              <div className="package-badge">
                PACKAGE
              </div>

              <h3>
                {pkg.name}
              </h3>

              <div className="package-price">
                ₹{pkg.price}
              </div>

              <ul>

                {pkg.services.map((serviceName, index) => (

                  <li key={index}>
                    <span>✓</span>
                    {serviceName}
                  </li>

                ))}

              </ul>

              <button
                className="primary-btn"
                onClick={() => navigate("/booking")}
              >
                Book Package
                <span> →</span>
              </button>

            </div>

          ))}

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section
        className="about-section"
        id="about"
      >

        <div className="about-content">

          <p className="section-label">
            ABOUT GENT'S GLOW
          </p>

          <h2>
            Grooming.
            <br />
            <span>Redefined.</span>
          </h2>

          <p>
            Gent's Glow is a premium men's grooming destination
            created for gentlemen who value style, confidence
            and exceptional personal care.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/register")}
          >
            Become a Member
            <span> →</span>
          </button>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footer-logo">
          GENT'S <span>GLOW</span>
        </div>

        <p>
          Look Sharp. Feel Confident.
        </p>

        <div className="footer-links">

          <button onClick={() => navigate("/")}>
            Home
          </button>

          <a href="#services">
            Services
          </a>

          <a href="#packages">
            Packages
          </a>

          <button onClick={() => navigate("/login")}>
            Login
          </button>

        </div>

        <div className="footer-copy">
          © {new Date().getFullYear()} Gent's Glow.
          All rights reserved.
        </div>

      </footer>

    </div>
  );
}


/* =========================================
   APP ROUTES
========================================= */

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/booking"
          element={<Booking />}
        />

        <Route
          path="/bookings"
          element={<MyBookings />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

