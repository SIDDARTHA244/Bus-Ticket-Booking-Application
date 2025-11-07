import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../api/api';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const { schedule, selectedSeats, totalAmount } = location.state || {};

  if (!schedule || !selectedSeats) {
    navigate('/');
    return null;
  }

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError('');

      // Create booking first
      const bookingResponse = await bookingAPI.create({
        scheduleId: schedule._id,
        seats: selectedSeats,
      });

      const booking = bookingResponse.data;

      // Process payment (stub)
      await bookingAPI.processPayment({
        amount: totalAmount,
        bookingReference: booking.bookingReference,
      });

      // Navigate to profile with success message
      navigate('/profile', {
        state: { message: 'Booking confirmed successfully!' },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        <div className="booking-details-card">
          <h2>Booking Details</h2>
          <div className="detail-row">
            <span>Route:</span>
            <span>
              {schedule.origin} → {schedule.destination}
            </span>
          </div>
          <div className="detail-row">
            <span>Bus:</span>
            <span>{schedule.bus.busName}</span>
          </div>
          <div className="detail-row">
            <span>Date:</span>
            <span>{new Date(schedule.date).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span>Time:</span>
            <span>
              {schedule.departureTime} - {schedule.arrivalTime}
            </span>
          </div>
          <div className="detail-row">
            <span>Selected Seats:</span>
            <span>{selectedSeats.join(', ')}</span>
          </div>
          <div className="detail-row total">
            <span>Total Amount:</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        <div className="payment-card">
          <h2>Payment</h2>
          <p className="payment-note">
            This is a payment simulation. Click the button below to complete your booking.
          </p>

          {error && <div className="error-message">{error}</div>}

          <button
            className="btn btn-primary btn-large"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Confirm & Pay'}
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={processing}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
