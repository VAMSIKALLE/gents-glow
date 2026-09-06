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

  const handleBookPackage = (pkg) => {
    navigate("/booking", {
      state: {
        package: pkg
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

          <a href="#home">Home</a>

          <a href="#services">Services</a>

          <a href="#packages">Packages</a>

          <a href="#about">About</a>

          <a href="#contact">Contact</a>

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
                onClick={() => handleBookPackage(pkg)}
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


      {/* ================= CONTACT & LOCATION ================= */}

      <section
        className="contact-section"
        id="contact"
      >

        <div className="section-heading">

          <p className="section-label">
            VISIT GENT'S GLOW
          </p>

          <h2>
            Contact & Location
          </h2>

          <span>
            We're here to help you look your best.
          </span>

        </div>


        <div className="contact-container">

          {/* CONTACT INFORMATION */}

          <div className="contact-info">

            <div className="contact-card">

              <div className="contact-icon">
                👤
              </div>

              <div>
                <span>ADMIN</span>
                <h3>Kalle Vamsi</h3>
              </div>

            </div>


            <div className="contact-card">

              <div className="contact-icon">
                📞
              </div>

              <div>
                <span>PHONE</span>

                <h3>
                  <a href="tel:+917993500490">
                    +91 7993500490
                  </a>
                </h3>
              </div>

            </div>


            <div className="contact-card">

              <div className="contact-icon">
                ✉️
              </div>

              <div>
                <span>EMAIL</span>

                <h3>
                  <a href="mailto:vamsikalle360@gmail.com">
                    vamsikalle360@gmail.com
                  </a>
                </h3>
              </div>

            </div>


            <div className="contact-card">

              <div className="contact-icon">
                📍
              </div>

              <div>
                <span>SHOP ADDRESS</span>

                <h3>
                  JNTU Metro Station,
                  <br />
                  Nijampet X Road,
                  <br />
                  Hyderabad
                </h3>
              </div>

            </div>


            <div className="contact-card">

              <div className="contact-icon">
                🕘
              </div>

              <div>
                <span>OPENING HOURS</span>

                <h3>
                  9:00 AM – 10:00 PM
                </h3>
              </div>

            </div>


            <a
              className="directions-btn"
              href="https://www.google.com/maps/search/?api=1&query=Kukatpally%20Housing%20Board%20Colony%2C%20Dharma%20Reddy%20Colony%20Phase%20II%2C%20Kukatpally%2C%20Hyderabad%2C%20Telangana%20500085"
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 Get Directions
              <span> →</span>
            </a>

          </div>


          {/* REAL GOOGLE MAP */}

          <div className="map-wrapper">

            <iframe
              title="GENT'S GLOW Location"
              src="https://www.google.com/maps?q=Kukatpally%20Housing%20Board%20Colony%2C%20Dharma%20Reddy%20Colony%20Phase%20II%2C%20Kukatpally%2C%20Hyderabad%2C%20Telangana%20500085&output=embed"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

          </div>

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

          <a href="#contact">
            Contact
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