import { Link } from "react-router-dom";
import {
  Clock,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Search,
  CreditCard,
  Car,
  Users,
  Mail,
  Phone,
} from "lucide-react";

function Landing() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <Link to="/" className="logo">
          <span>P</span>
          PARKit
        </Link>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn light-btn">
            Login
          </Link>

          <Link to="/signup" className="btn primary-btn">
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="hero-section" id="home">
        <div className="hero-content">
          <p className="eyebrow">SMART PARKING SOLUTION</p>

          <h1>
            Smart Parking <br />
            Made <span>Simple</span>
          </h1>

          <p className="hero-text">
            Find, book, and manage parking spots with ease. Save time, avoid
            stress, and park smarter every day.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="btn primary-btn large-btn">
              Get Started <ArrowRight size={16} />
            </Link>

            <Link to="/login" className="btn outline-btn large-btn">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="city-bg"></div>

          <div className="parking-card">
            <div className="parking-sign">P</div>

            <div className="car-shape">
              <div className="car-window"></div>
              <div className="car-body"></div>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <h2>Why Choose PARKit?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <MapPin />
            <h3>Easy Booking</h3>
            <p>
              Users can search parking locations, select parking time, choose
              required slots, and book instantly.
            </p>
          </div>

          <div className="feature-card">
            <Clock />
            <h3>Save Time</h3>
            <p>
              No more waiting or searching manually. PARKit helps users find
              available parking spaces quickly.
            </p>
          </div>

          <div className="feature-card">
            <ShieldCheck />
            <h3>Secure & Safe</h3>
            <p>
              Bookings are tracked with payment status, vehicle details, and
              verified user accounts.
            </p>
          </div>

          <div className="feature-card">
            <Search />
            <h3>Location Search</h3>
            <p>
              Customers can search parking spots by location and view available
              spaces before booking.
            </p>
          </div>

          <div className="feature-card">
            <CreditCard />
            <h3>Online Payment</h3>
            <p>
              Razorpay payment integration allows users to pay online and
              download invoices from the payment section.
            </p>
          </div>

          <div className="feature-card">
            <Car />
            <h3>Slot Management</h3>
            <p>
              Admin can add parking areas, upload images, manage availability,
              and track booked spaces.
            </p>
          </div>
        </div>
      </section>

      <section className="features-section" id="about">
        <h2>About PARKit</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <Car />
            <h3>Project Overview</h3>
            <p>
              PARKit is a MERN Stack Parking Management System built to solve
              parking availability, booking, and payment problems in a simple
              digital way.
            </p>
          </div>

          <div className="feature-card">
            <Users />
            <h3>User & Admin System</h3>
            <p>
              Users can book parking and manage their payments, while admins can
              manage parking slots, users, bookings, and reports.
            </p>
          </div>

          <div className="feature-card">
            <ShieldCheck />
            <h3>Modern Features</h3>
            <p>
              The system includes JWT authentication, Cloudinary image upload,
              Razorpay payments, booking history, invoices, and reports.
            </p>
          </div>
        </div>
      </section>

      <section className="features-section" id="contact">
        <h2>Contact Us</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <Mail />
            <h3>Email Support</h3>
            <p>
              For booking or payment related queries, users can contact the
              PARKit support team through email.
            </p>
          </div>

          <div className="feature-card">
            <Phone />
            <h3>Customer Help</h3>
            <p>
              PARKit helps customers with parking search, booking confirmation,
              payment invoices, and cancellation support.
            </p>
          </div>

          <div className="feature-card">
            <MapPin />
            <h3>Parking Locations</h3>
            <p>
              Admin can add multiple parking locations such as malls, airports,
              metro stations, hospitals, and office parking areas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
