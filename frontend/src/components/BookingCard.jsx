function BookingCard({ booking, onCancel }) {
  const canCancel = booking.status === 'confirmed';

  return (
    <div className={`booking-card ${booking.status}`}>
      <div className="booking-header">
        <div>
          <h3>Booking Reference: {booking.bookingReference}</h3>
          <span className={`status-badge ${booking.status}`}>{booking.status}</span>
        </div>
        <div className="booking-date">
          {new Date(booking.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="booking-details">
        <div className="detail-row">
          <span className="label">Route:</span>
          <span>
            {booking.schedule.origin} → {booking.schedule.destination}
          </span>
        </div>
        <div className="detail-row">
          <span className="label">Bus:</span>
          <span>{booking.schedule.bus.busName}</span>
        </div>
        <div className="detail-row">
          <span className="label">Date:</span>
          <span>{new Date(booking.schedule.date).toLocaleDateString()}</span>
        </div>
        <div className="detail-row">
          <span className="label">Time:</span>
          <span>
            {booking.schedule.departureTime} - {booking.schedule.arrivalTime}
          </span>
        </div>
        <div className="detail-row">
          <span className="label">Seats:</span>
          <span>{booking.seats.join(', ')}</span>
        </div>
        <div className="detail-row">
          <span className="label">Total Amount:</span>
          <strong>₹{booking.totalAmount}</strong>
        </div>
      </div>

      {canCancel && (
        <div className="booking-actions">
          <button
            className="btn btn-danger"
            onClick={() => onCancel(booking._id)}
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default BookingCard;
