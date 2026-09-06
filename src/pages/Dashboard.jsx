
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import data from "../data/data.json";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = useCallback(async () => {
        try {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error || !user) {
                navigate("/login");
                return;
            }

            setUser(user);
        } catch (error) {
            console.error("User check error:", error);
            navigate("/login");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        void Promise.resolve().then(checkUser);
    }, [checkUser]);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleBookService = (service) => {
        navigate("/booking", {
            state: {
                package : service,
            },
        });
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-logo">GENT'S GLOW</div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            {/* ================= NAVBAR ================= */}

            <nav className="dashboard-navbar">

                <div
                    className="dashboard-logo"
                    onClick={() => navigate("/")}
                >
                    GENT'S <span>GLOW</span>
                </div>

                <div className="dashboard-nav-right">


                    <button
                        className="nav-home-button"
                        onClick={() => navigate("/")}
                    >
                        <span>⌂</span>
                        Home
                    </button>




                    {/* MY BOOKINGS */}

                    <button
                        className="nav-bookings-button"
                        onClick={() => navigate("/bookings")}
                    >
                        My Bookings
                        <span>→</span>
                    </button>

                    {/* PROFILE */}

                    <button
                        className="nav-profile-button"
                        onClick={() => navigate("/profile")}
                    >
                        <span className="profile-nav-icon">👤</span>
                        Profile
                    </button>

                    {/* USER EMAIL */}

                    <span className="user-email">
                        {user?.email}
                    </span>

                    {/* LOGOUT */}

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* ================= HERO ================= */}

            <section className="dashboard-hero">

                <div className="hero-content">

                    <span className="hero-small-title">
                        WELCOME TO GENT'S GLOW
                    </span>

                    <h1>
                        Look Sharp.
                        <br />
                        <span>Feel Confident.</span>
                    </h1>

                    <p>
                        Premium grooming experiences designed
                        for the modern gentleman.
                    </p>

                    <button
                        className="hero-book-button"
                        onClick={() => navigate("/booking")}
                    >
                        Book an Appointment
                        <span> →</span>
                    </button>

                </div>

            </section>


            {/* ================= QUICK ACTIONS ================= */}

            <section className="dashboard-section">

                <div className="section-heading">

                    <span>YOUR ACCOUNT</span>

                    <h2>Quick Actions</h2>

                    <p>
                        Everything you need to manage your grooming experience.
                    </p>

                </div>


                <div className="quick-actions">

                    {/* BOOK APPOINTMENT */}

                    <div
                        className="quick-card"
                        onClick={() => navigate("/booking")}
                    >

                        <div className="quick-icon">
                            📅
                        </div>

                        <div>
                            <h3>Book Appointment</h3>

                            <p>
                                Choose your service, date and time.
                            </p>
                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </div>


                    {/* VIEW BOOKINGS */}

                    <div
                        className="quick-card"
                        onClick={() => navigate("/bookings")}
                    >

                        <div className="quick-icon">
                            📋
                        </div>

                        <div>
                            <h3>View Bookings</h3>

                            <p>
                                View and manage your appointments.
                            </p>
                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </div>


                    {/* PROFILE */}

                    <div
                        className="quick-card"
                        onClick={() => navigate("/profile")}
                    >

                        <div className="quick-icon">
                            👤
                        </div>

                        <div>
                            <h3>My Profile</h3>

                            <p>
                                Manage your personal information.
                            </p>
                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </div>

                </div>

            </section>


            {/* ================= SERVICES ================= */}

            <section className="dashboard-section services-section">

                <div className="section-heading">

                    <span>OUR SERVICES</span>

                    <h2>Premium Grooming</h2>

                    <p>
                        Professional grooming services for the modern gentleman.
                    </p>

                </div>


                <div className="dashboard-services">

                    {data.services.map((service) => (

                        <div
                            className="dashboard-service-card"
                            key={service.id}
                        >

                            <div className="service-number">
                                {String(service.id).padStart(2, "0")}
                            </div>

                            <div className="service-content">

                                <h3>
                                    {service.name}
                                </h3>

                                <div className="service-info">

                                    <span>
                                        ⏱ {service.duration}
                                    </span>

                                    <strong>
                                        ₹{service.price}
                                    </strong>

                                </div>

                                <button
                                    className="service-book-button"
                                    onClick={() => handleBookService(service)}
                                >
                                    <span>
                                        Book Now
                                    </span>

                                    <span>
                                        →
                                    </span>
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </section>


            {/* ================= PACKAGES ================= */}

            <section className="dashboard-section packages-section">

                <div className="section-heading">

                    <span>
                        EXCLUSIVE PACKAGES
                    </span>

                    <h2>
                        Grooming Packages
                    </h2>

                    <p>
                        Complete grooming experiences at special prices.
                    </p>

                </div>


                <div className="dashboard-packages">

                    {data.packages.map((pkg) => (

                        <div
                            className="dashboard-package-card"
                            key={pkg.id}
                        >

                            <div className="package-top">

                                <span>
                                    PACKAGE
                                </span>

                                <strong>
                                    ₹{pkg.price}
                                </strong>

                            </div>


                            <h3>
                                {pkg.name}
                            </h3>


                            <div className="package-services">

                                {pkg.services.map((serviceName, index) => (

                                    <div
                                        className="package-service"
                                        key={index}
                                    >

                                        <span>
                                            ✓
                                        </span>

                                        {serviceName}

                                    </div>

                                ))}

                            </div>


                            <button
                                onClick={() => navigate("/booking")}
                            >
                                Book Package
                                <span>
                                    →
                                </span>
                            </button>

                        </div>

                    ))}

                </div>

            </section>


            {/* ================= PROFILE SUMMARY ================= */}

            <section className="dashboard-profile">

                <div className="profile-content">

                    <span>
                        YOUR ACCOUNT
                    </span>

                    <h2>
                        Welcome back, Gentleman.
                    </h2>

                    <p>
                        You are currently logged in as:
                    </p>

                    <strong>
                        {user?.email}
                    </strong>

                    <br />

                    {/* MANAGE PROFILE */}

                    <button
                        className="profile-button"
                        onClick={() => navigate("/profile")}
                    >
                        Manage Profile
                        <span>
                            →
                        </span>
                    </button>

                </div>


                <div className="profile-icon">
                    👤
                </div>

            </section>


            {/* ================= FOOTER ================= */}

            <footer className="dashboard-footer">

                <div className="footer-logo">
                    GENT'S <span>GLOW</span>
                </div>

                <p>
                    Look Sharp. Feel Confident.
                </p>


                <div className="footer-links">

                    <button
                        onClick={() => navigate("/")}
                    >
                        Home
                    </button>

                    <button
                        onClick={() => navigate("/booking")}
                    >
                        Book Appointment
                    </button>

                    <button
                        onClick={() => navigate("/bookings")}
                    >
                        My Bookings
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </button>

                </div>


                <div className="footer-copy">
                    © {new Date().getFullYear()} Gent's Glow. All rights reserved.
                </div>

            </footer>

        </div>
    );
}

export default Dashboard;

