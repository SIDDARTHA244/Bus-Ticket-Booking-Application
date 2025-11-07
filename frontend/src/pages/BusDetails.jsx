import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { busAPI } from '../api/api';

function BusDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        const { data } = await busAPI.getBusDetails(id);
        setBus(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bus details');
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading bus details...</div>;
  }

  if (error || !bus) {
    return <div className="error-message">{error || 'Bus not found'}</div>;
  }

  return (
    <div className="bus-details-page">
      <button onClick={() => navigate(-1)} className="btn btn-secondary">
        ← Back
      </button>

      <div className="bus-details-card">
        <h1>{bus.busName}</h1>
        <div className="bus-info">
          <div className="info-item">
            <strong>Bus Number:</strong> {bus.busNumber}
          </div>
          <div className="info-item">
            <strong>Bus Type:</strong> {bus.busType}
          </div>
          <div className="info-item">
            <strong>Total Seats:</strong> {bus.totalSeats}
          </div>
          <div className="info-item">
            <strong>Operator:</strong> {bus.operator}
          </div>
        </div>

        {bus.amenities && bus.amenities.length > 0 && (
          <div className="amenities-section">
            <h2>Amenities</h2>
            <div className="amenities-list">
              {bus.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusDetails;
