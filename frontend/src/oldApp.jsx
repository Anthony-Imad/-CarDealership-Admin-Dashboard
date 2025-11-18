import './App.css';
import EntityForm from './components/EntityForm';
import leftSidebar from './components/leftSidebar';
import { act, useState } from 'react'
function App() {

  const [entityData, setEntityData] = useState({});
  const [activeEntity, setActiveEntity] = useState('cars');
  /* normal state usage 
  const [carInfo, setCarInfo] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    isAvailable: '',
  })
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    isActive: ''
  })
  */

  const entityConfig = { /*entity details/fields (car,customer)*/  
    cars: {
      fields: [
        {name: 'make', type: 'text', label: 'make'},
        {name: 'model', type: 'text', label: 'model'},
        {name: 'year', type: 'number', label: 'year'},
        {name: 'licensePlate', type: 'number', label: 'licensePlate'},
        {name: 'isAvailable', type: 'boolean', label: 'isAvailable'},
        {name: 'image', type: 'file', label: 'Car Image'}
      ],
      displayFields: ['make', 'model', 'year', 'licensePlate', 'isAvailable']
    },

    customers: {
      fields: [
        {name: 'name', type: 'text', label: 'name'},
        {name: 'email', type: 'email', label: 'email'},
        {name: 'phone', type: 'number', label: 'phone'},
        {name: 'licenseNumber', type: 'text', label: 'licenseNumber'},
        {name: 'isActive', type: 'boolean', label: 'isActive'},
        {name: 'image', type: 'file', label: 'Profile Picture'}
      ],
      displayFields: ['name', 'email', 'phone', 'licenseNumber', 'isActive']
    }
  }


  const leftSidebarItems = [ /*it help .map display all the sidebar item */ 
    {id: 'registerCars', label: 'Register Car'},
    {id: 'registerCustomers', label: 'Register Customers'},
    {id: 'registerRentals', label: 'Register Rentals'},
  ]

  const rightSidebarItems = [
    {id: 'cars', label: 'cars'},
    {id: 'customers', label:'customers'},
    {id:'rentals', label:'rentals'}
  ]

  return (
    <div className="app-container">
    <div className="logo-header">
    <div className="logo-content">
    <div className="brand-logo">AD</div>
    <div className="brand-text">
      <div className="brand-title">AutoDealer</div>
      <div className="brand-subtitle">Admin Dashboard</div>
    </div>
  </div>
</div>
    
    <div> {/*display items on the left sidebar (create car, customer, rentals)*/} 
    <leftSidebar
    items={leftSidebarItems}
    activeItem={activeEntity}
    onItemClick={setActiveEntity}
    />
    </div>

    <div>
    <rightSidebar 
    itemss={rightSidebarItems}
    activeItem={activeEntity}
    onItemClick={setActiveEntity}
    />
    </div>
    

    <div className="main-content">
      <div className="content-header"> {/*just the header*/}
        <h1 className="content-title">
          {activeEntity.charAt(0).toUpperCase() + activeEntity.slice(1)} Management
          </h1>
           <p className="content-description">
            Manage your {activeEntity} data and information
          </p>
      </div>

    <div className="form-container">  {/*input fields*/} 
    <EntityForm
      entityData={entityData}
      setEntityData={setEntityData}
      fields={entityConfig[activeEntity]?.fields || []}
    />
     <div className="submit-section">
    <button className="submit-button">submit</button>
        </div>
        </div>
      </div>
   </div>
  )
}

export default App
