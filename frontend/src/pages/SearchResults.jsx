import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { busAPI } from '../api/api';
import BusCard from '../components/BusCard';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const { data } = await busAPI.search({ origin, destination, date });
        setBuses(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch buses');
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination && date) {
      fetchBuses();
    }
  }, [origin, destination, date]);

  if (loading) {
    return <div className="loading">Loading buses...</div>;
  }

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Available Buses</h1>
        <p>
          {origin} → {destination} | {new Date(date).toLocaleDateString()}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {buses.length === 0 ? (
        <div className="no-results">
          <h2>No buses found</h2>
          <p>Try searching for a different route or date</p>
        </div>
      ) : (
        <div className="bus-list">
          {buses.map((schedule) => (
            <BusCard key={schedule._id} schedule={schedule} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
