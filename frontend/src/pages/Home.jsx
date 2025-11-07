import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    date: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { origin, destination, date } = searchData;
    if (origin && destination && date) {
      navigate(`/search?origin=${origin}&destination=${destination}&date=${date}`);
    }
  };

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Book Your Bus Tickets</h1>
          <p>Travel comfortably across India with our premium bus services</p>
        </div>

        <div className="search-card">
          <h2>Search Buses</h2>
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group">
              <label htmlFor="origin">From</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={searchData.origin}
                onChange={handleChange}
                placeholder="Enter origin city"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="destination">To</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={searchData.destination}
                onChange={handleChange}
                placeholder="Enter destination city"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date of Journey</label>
              <input
                type="date"
                id="date"
                name="date"
                value={searchData.date}
                onChange={handleChange}
                min={today}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              Search Buses
            </button>
          </form>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚌</div>
            <h3>Wide Network</h3>
            <p>Connect to over 100+ cities across India</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💺</div>
            <h3>Comfortable Seats</h3>
            <p>Choose from various seat types for your comfort</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Easy Booking</h3>
            <p>Book tickets in just a few clicks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Instant Confirmation</h3>
            <p>Get booking confirmation instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
