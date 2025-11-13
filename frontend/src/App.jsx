import EntityForm from './components/EntityForm';
import { useState } from 'react'
function App() {

  const [entityData, setEntityData] = useState([]);
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
      ],
      displayFields: ['make', 'model', 'year', 'licensePlate', 'isAvailable']
    },

    customers: {
      fields: [
        {name: 'name', type: 'text', label: 'name'},
        {name: 'email', type: 'email', label: 'email'},
        {name: 'phone', type: 'number', label: 'phone'},
        {name: 'licenseNumber', type: 'text', label: 'licenseNumber'},
        {name: 'isActive', type: 'boolean', label: 'isActive'}
      ],
      displayFields: ['name', 'email', 'phone', 'licenseNumber', 'isActive']
    }



  }

  sidebarItems = [
    {id: 'car, label: car},
    {id: 'customer', label: customer},
    {id: rental, label: rental},
    {id: }
  ]

  return (
    <>
    <div> 
    {/*input fields*/} 
    <EntityForm
      entityData={entityData}
      setEntityData={setEntityData}
      fields={entityConfig[activeEntity].fields}
    />
    <button>submit</button>
    </div>

    <div>
    
    </div>
    </>
  )
}

export default App
