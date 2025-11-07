import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { busAPI } from '../api/api';
import SeatGrid from '../components/SeatGrid';

function SeatSelection() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const { data } = await busAPI.getScheduleDetails(scheduleId);
        setSchedule(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId]);

  const handleSeatToggle = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    navigate('/checkout', {
      state: {
        schedule,
        selectedSeats,
        totalAmount: selectedSeats.length * schedule.price,
      },
    });
  };

  if (loading) {
    return <div className="loading">Loading seats...</div>;
  }

  if (error || !schedule) {
    return <div className="error-message">{error || 'Schedule not found'}</div>;
  }

  const totalAmount = selectedSeats.length * schedule.price;

  return (
    <div className="seat-selection-page">
      <div className="journey-info">
        <h1>Select Your Seats</h1>
        <div className="route-info">
          <p>
            <strong>{schedule.origin}</strong> → <strong>{schedule.destination}</strong>
          </p>
          <p>{schedule.bus.busName} ({schedule.bus.busType})</p>
          <p>
            {new Date(schedule.date).toLocaleDateString()} | {schedule.departureTime} - {schedule.arrivalTime}
          </p>
        </div>
      </div>

      <div className="seat-selection-container">
        <div className="seat-grid-wrapper">
          <div className="seat-legend">
            <div className="legend-item">
              <span className="seat available"></span> Available
            </div>
            <div className="legend-item">
              <span className="seat selected"></span> Selected
            </div>
            <div className="legend-item">
              <span className="seat booked"></span> Booked
            </div>
          </div>

          <SeatGrid
            totalSeats={schedule.bus.totalSeats}
            bookedSeats={schedule.bookedSeats}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
          />
        </div>

        <div className="booking-summary">
          <h2>Booking Summary</h2>
          <div className="summary-item">
            <span>Selected Seats:</span>
            <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
          </div>
          <div className="summary-item">
            <span>Price per seat:</span>
            <span>₹{schedule.price}</span>
          </div>
          <div className="summary-item total">
            <span>Total Amount:</span>
            <span>₹{totalAmount}</span>
          </div>
          <button
            className="btn btn-primary btn-large"
            onClick={handleProceed}
            disabled={selectedSeats.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;
