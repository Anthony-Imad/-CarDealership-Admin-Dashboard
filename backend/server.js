// backend/server.js - Express server with API routes
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import { Car, Customer, Rental } from './models.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// === CAR ROUTES ===

// GET all cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single car by ID
app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new car with image upload
app.post('/api/cars', upload.single('image'), async (req, res) => {
  try {
    const { make, model, year, licensePlate, isAvailable } = req.body;
    
    const carData = {
      make,
      model,
      year: parseInt(year),
      licensePlate,
      isAvailable: isAvailable === 'true'
    };

    // If image was uploaded, add image data
    if (req.file) {
      carData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }

    const car = new Car(carData);
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE car
app.put('/api/cars/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Handle image update
    if (req.file) {
      updates.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }

    const car = await Car.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE car
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// === CUSTOMER ROUTES ===

// GET all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new customer
app.post('/api/customers', upload.single('image'), async (req, res) => {
  try {
    const { name, email, phone, licenseNumber, isActive } = req.body;
    
    const customerData = {
      name,
      email,
      phone,
      licenseNumber,
      isActive: isActive === 'true'
    };

    if (req.file) {
      customerData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }

    const customer = new Customer(customerData);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE customer
app.put('/api/customers/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (req.file) {
      updates.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// === RENTAL ROUTES ===

// GET all rentals with populated data
app.get('/api/rentals', async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('carId')
      .populate('customerId');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new rental
app.post('/api/rentals', async (req, res) => {
  try {
    const { carId, customerId, startDate, endDate, totalCost } = req.body;
    
    const rental = new Rental({
      carId,
      customerId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalCost: parseFloat(totalCost)
    });

    await rental.save();

    // Update car and customer rental status
    await Car.findByIdAndUpdate(carId, { isRented: true, isAvailable: false });
    await Customer.findByIdAndUpdate(customerId, { hasRental: true });

    // Populate the response with car and customer data
    const populatedRental = await Rental.findById(rental._id)
      .populate('carId')
      .populate('customerId');

    res.status(201).json(populatedRental);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE rental
app.delete('/api/rentals/:id', async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    // Update car and customer status
    await Car.findByIdAndUpdate(rental.carId, { isRented: false, isAvailable: true });
    await Customer.findByIdAndUpdate(rental.customerId, { hasRental: false });

    await Rental.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});