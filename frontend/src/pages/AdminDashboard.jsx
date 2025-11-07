import { useState, useEffect } from 'react';
import { adminAPI } from '../api/api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('buses');
  const [buses, setBuses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (activeTab === 'buses') fetchBuses();
    else if (activeTab === 'schedules') fetchSchedules();
    else if (activeTab === 'bookings') fetchBookings();
  }, [activeTab]);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAllBuses();
      setBuses(data);
    } catch (err) {
      alert('Failed to fetch buses');
    }
    setLoading(false);
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAllSchedules();
      setSchedules(data);
    } catch (err) {
      alert('Failed to fetch schedules');
    }
    setLoading(false);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAllBookings();
      setBookings(data);
    } catch (err) {
      alert('Failed to fetch bookings');
    }
    setLoading(false);
  };

  const openModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'createBus') {
        await adminAPI.createBus(formData);
        fetchBuses();
      } else if (modalType === 'createSchedule') {
        await adminAPI.createSchedule(formData);
        fetchSchedules();
      }
      setShowModal(false);
      setFormData({});
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      if (type === 'bus') {
        await adminAPI.deleteBus(id);
        fetchBuses();
      } else if (type === 'schedule') {
        await adminAPI.deleteSchedule(id);
        fetchSchedules();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="tabs">
        <button
          className={activeTab === 'buses' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('buses')}
        >
          Buses
        </button>
        <button
          className={activeTab === 'schedules' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('schedules')}
        >
          Schedules
        </button>
        <button
          className={activeTab === 'bookings' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'buses' && (
          <div>
            <button className="btn btn-primary" onClick={() => openModal('createBus')}>
              Add New Bus
            </button>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Bus Number</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Seats</th>
                    <th>Operator</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus._id}>
                      <td>{bus.busNumber}</td>
                      <td>{bus.busName}</td>
                      <td>{bus.busType}</td>
                      <td>{bus.totalSeats}</td>
                      <td>{bus.operator}</td>
                      <td>
                        <button
                          className="btn-small btn-danger"
                          onClick={() => handleDelete('bus', bus._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'schedules' && (
          <div>
            <button className="btn btn-primary" onClick={() => openModal('createSchedule')}>
              Add New Schedule
            </button>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Bus</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule._id}>
                      <td>{schedule.bus?.busName}</td>
                      <td>
                        {schedule.origin} → {schedule.destination}
                      </td>
                      <td>{new Date(schedule.date).toLocaleDateString()}</td>
                      <td>
                        {schedule.departureTime} - {schedule.arrivalTime}
                      </td>
                      <td>₹{schedule.price}</td>
                      <td>{schedule.availableSeats}</td>
                      <td>
                        <button
                          className="btn-small btn-danger"
                          onClick={() => handleDelete('schedule', schedule._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>User</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.bookingReference}</td>
                      <td>{booking.user?.name}</td>
                      <td>
                        {booking.schedule?.origin} → {booking.schedule?.destination}
                      </td>
                      <td>{new Date(booking.schedule?.date).toLocaleDateString()}</td>
                      <td>{booking.seats.join(', ')}</td>
                      <td>₹{booking.totalAmount}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modalType === 'createBus' ? 'Add New Bus' : 'Add New Schedule'}</h2>
            <form onSubmit={handleSubmit}>
              {modalType === 'createBus' ? (
                <>
                  <input
                    type="text"
                    placeholder="Bus Number"
                    value={formData.busNumber || ''}
                    onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Bus Name"
                    value={formData.busName || ''}
                    onChange={(e) => setFormData({ ...formData, busName: e.target.value })}
                    required
                  />
                  <select
                    value={formData.busType || ''}
                    onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                    <option value="Sleeper">Sleeper</option>
                    <option value="Semi-Sleeper">Semi-Sleeper</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Total Seats"
                    value={formData.totalSeats || ''}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Operator"
                    value={formData.operator || ''}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    required
                  />
                </>
              ) : (
                <>
                  <select
                    value={formData.busId || ''}
                    onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                    required
                  >
                    <option value="">Select Bus</option>
                    {buses.map((bus) => (
                      <option key={bus._id} value={bus._id}>
                        {bus.busName} ({bus.busNumber})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Origin"
                    value={formData.origin || ''}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Destination"
                    value={formData.destination || ''}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                  />
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                  <input
                    type="time"
                    placeholder="Departure Time"
                    value={formData.departureTime || ''}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    required
                  />
                  <input
                    type="time"
                    placeholder="Arrival Time"
                    value={formData.arrivalTime || ''}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </>
              )}
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
