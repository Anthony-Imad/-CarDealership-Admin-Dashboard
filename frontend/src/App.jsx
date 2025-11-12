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

  const entityConfig = {
    cars: {
      fields: [
        {name: 'make', type: 'text', label: ''},
        {name: 'model', type: 'text', label: ''},
        {name: 'year', type: 'number', label: ''},
        {name: 'licensePlate', type: 'number', label: ''},
        {name: 'isAvailable', type: 'boolean', label: ''},
      ],
      displayFields: ['make', 'model', 'year', 'licensePlate', 'isAvailable']
    },

    customers: {
      fields: [
        {name: 'name', type: 'text', label: ''},
        {name: 'email', type: 'email', label: ''},
        {name: 'phone', type: 'number', label: ''},
        {name: 'licenseNumber', type: 'text', label: ''},
        {name: 'isActive', type: 'boolean', label: ''}
      ],
      displayFields: ['name', 'email', 'phone', 'licenseNumber', 'isActive']
    }



  }

  return (
    <>
    <EntityForm
      entityData={entityData}
      setEntityData={setEntityData}
      fields={entityConfig[activeEntity].fields}
    />
    </>
  )
}

export default App
