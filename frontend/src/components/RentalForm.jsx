// RentalForm.jsx - For creating rentals by linking cars and customers
export default function RentalForm({ 
  rentalData, 
  setRentalData, 
  cars, 
  customers,
  selectedCar,
  selectedCustomer,
  onCarSelect,
  onCustomerSelect 
}) {
  
  const fields = [
    { name: 'carId', type: 'select', label: 'car', options: cars },
    { name: 'customerId', type: 'select', label: 'customer', options: customers },
    { name: 'startDate', type: 'date', label: 'start date' },
    { name: 'endDate', type: 'date', label: 'end date' },
    { name: 'totalCost', type: 'number', label: 'total cost' }
  ];

  const calculateCost = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    return days * 50; // $50 per day base rate
  };

  const handleDateChange = (field, value) => {
    const newData = {
      ...rentalData,
      [field]: value
    };
    
    // Auto-calculate cost when both dates are set
    if (newData.startDate && newData.endDate) {
      newData.totalCost = calculateCost(newData.startDate, newData.endDate);
    }
    
    setRentalData(newData);
  };

  return (
    <div className="form-grid">
      {/* Car Selection */}
      <div className="form-group">
        <label className="form-label">Select Car</label>
        <div className="selection-cards">
          {cars.map(car => (
            <div 
              key={car._id}
              className={`selection-card ${selectedCar?._id === car._id ? 'selected' : ''} ${car.isRented ? 'rented' : ''}`}
              onClick={() => !car.isRented && onCarSelect(car)}
            >
              {car.isRented && <div className="rental-badge">Rented</div>}
              {car.image && (
                <img src={car.image} alt={car.make} className="selection-image" />
              )}
              <h4>{car.make} {car.model}</h4>
              <p>License: {car.licensePlate}</p>
              <span className={`status ${car.isAvailable ? 'available' : 'unavailable'}`}>
                {car.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Selection */}
      <div className="form-group">
        <label className="form-label">Select Customer</label>
        <div className="selection-cards">
          {customers.map(customer => (
            <div 
              key={customer._id}
              className={`selection-card ${selectedCustomer?._id === customer._id ? 'selected' : ''}`}
              onClick={() => onCustomerSelect(customer)}
            >
              {customer.image && (
                <img src={customer.image} alt={customer.name} className="selection-image" />
              )}
              <h4>{customer.name}</h4>
              <p>{customer.email}</p>
              <span className={`status ${customer.isActive ? 'active' : 'inactive'}`}>
                {customer.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rental Details */}
      {selectedCar && selectedCustomer && (
        <>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={rentalData.startDate || ''}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={rentalData.endDate || ''}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Cost</label>
            <input
              type="number"
              className="form-input"
              value={rentalData.totalCost || ''}
              onChange={(e) => setRentalData(prev => ({
                ...prev,
                totalCost: parseFloat(e.target.value)
              }))}
              placeholder="Auto-calculated or enter manually"
            />
          </div>
        </>
      )}
    </div>
  );
}
