import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BusCard({ schedule }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/seat-selection/${schedule._id}`);
  };

  return (
    <div className="bus-card">
      <div className="bus-card-header">
        <h3>{schedule.bus.busName}</h3>
        <span className="bus-type-badge">{schedule.bus.busType}</span>
      </div>

      <div className="bus-card-body">
        <div className="bus-route">
          <div className="route-point">
            <strong>{schedule.departureTime}</strong>
            <p>{schedule.origin}</p>
          </div>
          <div className="route-line">→</div>
          <div className="route-point">
            <strong>{schedule.arrivalTime}</strong>
            <p>{schedule.destination}</p>
          </div>
        </div>

        <div className="bus-info-row">
          <div className="info-item">
            <span className="label">Operator:</span>
            <span>{schedule.bus.operator}</span>
          </div>
          <div className="info-item">
            <span className="label">Available Seats:</span>
            <span>{schedule.availableSeats}</span>
          </div>
        </div>

        {schedule.bus.amenities && schedule.bus.amenities.length > 0 && (
          <div className="amenities">
            {schedule.bus.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="amenity-badge">
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bus-card-footer">
        <div className="price">
          <span className="label">Starting from</span>
          <strong>₹{schedule.price}</strong>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleBookNow}
          disabled={schedule.availableSeats === 0}
        >
          {schedule.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
        </button>
      </div>
    </div>
  );
}

export default BusCard;
