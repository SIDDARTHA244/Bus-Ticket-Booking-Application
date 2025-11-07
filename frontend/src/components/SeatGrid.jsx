function SeatGrid({ totalSeats, bookedSeats, selectedSeats, onSeatToggle }) {
  const rows = Math.ceil(totalSeats / 4);
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  const getSeatClass = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return 'seat booked';
    if (selectedSeats.includes(seatNumber)) return 'seat selected';
    return 'seat available';
  };

  const handleSeatClick = (seatNumber) => {
    if (!bookedSeats.includes(seatNumber)) {
      onSeatToggle(seatNumber);
    }
  };

  return (
    <div className="seat-grid">
      <div className="driver-section">
        <div className="driver-seat">🚗 Driver</div>
      </div>

      <div className="seats-container">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {seats.slice(rowIndex * 4, (rowIndex + 1) * 4).map((seatNumber) => (
              <button
                key={seatNumber}
                className={getSeatClass(seatNumber)}
                onClick={() => handleSeatClick(seatNumber)}
                disabled={bookedSeats.includes(seatNumber)}
              >
                {seatNumber}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeatGrid;
