import './App.css';
import EntityForm from './components/EntityForm';
import RentalForm from './components/RentalForm';
import LeftSidebar from './components/leftSidebar';
import RightSidebar from './components/rightSidebar';
import { useState, useEffect } from 'react';

// API base URL
const API_BASE = 'http://localhost:5000/api';

function App() {
  const [entityData, setEntityData] = useState({});
  const [rentalData, setRentalData] = useState({});
  const [activeEntity, setActiveEntity] = useState('cars');
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingEntity, setEditingEntity] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load data from backend API
  useEffect(() => {
    loadCars();
    loadCustomers();
    loadRentals();
  }, []);

  // API functions
  const loadCars = async () => {
    try {
      const response = await fetch(`${API_BASE}/cars`);
      const carsData = await response.json();
      setCars(carsData);
    } catch (error) {
      console.error('Error loading cars:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE}/customers`);
      const customersData = await response.json();
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadRentals = async () => {
    try {
      const response = await fetch(`${API_BASE}/rentals`);
      const rentalsData = await response.json();
      setRentals(rentalsData);
    } catch (error) {
      console.error('Error loading rentals:', error);
    }
  };

  // Entity configuration (same as before)
  const entityConfig = {
    cars: {
      fields: [
        { name: 'make', type: 'text', label: 'make' },
        { name: 'model', type: 'text', label: 'model' },
        { name: 'year', type: 'number', label: 'year' },
        { name: 'licensePlate', type: 'text', label: 'license plate' },
        { name: 'isAvailable', type: 'boolean', label: 'availability' },
        { name: 'image', type: 'file', label: 'car image' }
      ]
    },
    customers: {
      fields: [
        { name: 'name', type: 'text', label: 'name' },
        { name: 'email', type: 'email', label: 'email' },
        { name: 'phone', type: 'text', label: 'phone' },
        { name: 'licenseNumber', type: 'text', label: 'license number' },
        { name: 'isActive', type: 'boolean', label: 'active status' },
        { name: 'image', type: 'file', label: 'profile picture' }
      ]
    }
  };

  const leftSidebarItems = [
    { id: 'cars', label: 'Register Car' },
    { id: 'customers', label: 'Register Customer' },
    { id: 'rentals', label: 'Create Rental' }
  ];

  const rightSidebarItems = [
    { id: 'cars', label: 'cars' },
    { id: 'customers', label: 'customers' },
    { id: 'rentals', label: 'rentals' }
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (activeEntity === 'rentals') {
        // Handle rental creation via API
        const response = await fetch(`${API_BASE}/rentals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...rentalData,
            carId: selectedCar._id,
            customerId: selectedCustomer._id
          })
        });

        if (!response.ok) throw new Error('Failed to create rental');
        
        setRentalData({});
        setSelectedCar(null);
        setSelectedCustomer(null);
        loadRentals();
        loadCars();
        loadCustomers();
        
      } else {
        // Handle car/customer creation/updating
        const formData = new FormData();
        
        // Add all fields to formData
        Object.keys(entityData).forEach(key => {
          if (key === 'image' && entityData[key] instanceof File) {
            formData.append('image', entityData[key]);
          } else if (key !== 'imageUrl' && key !== '_id') {
            // Don't send imageUrl (frontend only) or _id for new entities
            formData.append(key, entityData[key]);
          }
        });

        let response;
        if (isEditMode && editingEntity) {
          // Update existing entity
          response = await fetch(`${API_BASE}/${activeEntity}/${editingEntity._id}`, {
            method: 'PUT',
            body: formData // FormData for file upload
          });
          setIsEditMode(false);
          setEditingEntity(null);
        } else {
          // Create new entity
          response = await fetch(`${API_BASE}/${activeEntity}`, {
            method: 'POST',
            body: formData
          });
        }

        if (!response.ok) throw new Error('Failed to save entity');

        setEntityData({});
        loadCars();
        loadCustomers();
      }
      
      alert('Operation completed successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    }
  };

  // Handle entity editing
  const handleEdit = (entity, entityType) => {
    setEditingEntity(entity);
    setIsEditMode(true);
    setActiveEntity(entityType);
    
    // Convert image data for display
    const entityWithImage = { ...entity };
    if (entity.image && entity.image.data) {
      // Convert Buffer to base64 for image display
      const binaryData = new Uint8Array(entity.image.data);
      const base64Image = btoa(binaryData.reduce((data, byte) => data + String.fromCharCode(byte), ''));
      entityWithImage.imageUrl = `data:${entity.image.contentType};base64,${base64Image}`;
    }
    
    setEntityData(entityWithImage);
  };

  // Handle entity deletion
  const handleDelete = async (id, entityType) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`${API_BASE}/${entityType}/${id}`, { 
          method: 'DELETE' 
        });
        
        if (!response.ok) throw new Error('Failed to delete');
        
        // Update local state
        if (entityType === 'cars') {
          setCars(cars.filter(car => car._id !== id));
        } else if (entityType === 'customers') {
          setCustomers(customers.filter(customer => customer._id !== id));
        } else if (entityType === 'rentals') {
          setRentals(rentals.filter(rental => rental._id !== id));
        }
        
        alert('Record deleted successfully!');
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Error deleting record');
      }
    }
  };

  // Handle selection for rental
  const handleSelectForRental = (entity, entityType) => {
    if (activeEntity === 'rentals') {
      if (entityType === 'cars') {
        setSelectedCar(entity);
      } else if (entityType === 'customers') {
        setSelectedCustomer(entity);
      }
    }
  };

  // Get current entities for right sidebar
  const getCurrentEntities = () => {
    switch (activeEntity) {
      case 'cars': return cars;
      case 'customers': return customers;
      case 'rentals': return rentals;
      default: return [];
    }
  };

  // Rest of your component JSX remains the same...
  return (
    <div className="app-container">
      {/* Header */}
      <div className="logo-header">
        <div className="logo-content">
          <div className="brand-logo">AD</div>
          <div className="brand-text">
            <div className="brand-title">AutoDealer</div>
            <div className="brand-subtitle">Admin Dashboard</div>
          </div>
        </div>
      </div>
      
      {/* Left Sidebar - Creation */}
      <LeftSidebar
        items={leftSidebarItems}
        activeItem={activeEntity}
        onItemClick={setActiveEntity}
      />

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1 className="content-title">
            {isEditMode ? 'Edit ' : ''}
            {activeEntity.charAt(0).toUpperCase() + activeEntity.slice(1)} 
            {activeEntity === 'rentals' ? ' Creation' : ' Management'}
          </h1>
          <p className="content-description">
            {isEditMode ? 'Update existing record' : 
             activeEntity === 'rentals' ? 'Link cars and customers to create rentals' :
             `Manage your ${activeEntity} data and information`}
          </p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {activeEntity === 'rentals' ? (
              <RentalForm
                rentalData={rentalData}
                setRentalData={setRentalData}
                cars={cars.filter(car => car.isAvailable)}
                customers={customers.filter(customer => customer.isActive)}
                selectedCar={selectedCar}
                selectedCustomer={selectedCustomer}
                onCarSelect={setSelectedCar}
                onCustomerSelect={setSelectedCustomer}
              />
            ) : (
              <EntityForm
                entityData={entityData}
                setEntityData={setEntityData}
                fields={entityConfig[activeEntity]?.fields || []}
                isEdit={isEditMode}
                existingImage={editingEntity?.imageUrl}
              />
            )}
            
            <div className="submit-section">
              <button type="submit" className="submit-button">
                {isEditMode ? 'Update' : 'Submit'}
              </button>
              {isEditMode && (
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setIsEditMode(false);
                    setEditingEntity(null);
                    setEntityData({});
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right Sidebar - Viewing */}
      <RightSidebar
        items={rightSidebarItems}
        activeItem={activeEntity}
        onItemClick={setActiveEntity}
        entities={getCurrentEntities()}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelectForRental={handleSelectForRental}
      />
    </div>
  );
}

export default App;