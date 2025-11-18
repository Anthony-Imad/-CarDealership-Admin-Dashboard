// backend/server.js - Express server with API routes
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import connectDB, { Car, Customer, Rental } from './models.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// === HEALTH CHECK ===
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// === CAR ROUTES ===

// GET all cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET car by ID
app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CREATE new car
app.post('/api/cars', upload.single('image'), async (req, res) => {
  try {
    const { make, model, year, licensePlate, isAvailable } = req.body;
    
    // Validate required fields
    if (!make || !model || !year || !licensePlate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if license plate already exists
    const existingCar = await Car.findOne({ licensePlate });
    if (existingCar) {
      return res.status(400).json({ message: 'Car with this license plate already exists' });
    }

    const carData = {
      make,
      model,
      year: parseInt(year),
      licensePlate,
      isAvailable: isAvailable === 'true' || isAvailable === true
    };

    // Add image if uploaded
    if (req.file) {
      carData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }

    const car = new Car(carData);
    await car.save();
    
    res.status(201).json({
      message: 'Car created successfully',
      car: car
    });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(400).json({ message: 'Error creating car', error: error.message });
  }
});

// UPDATE car
app.put('/api/cars/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Handle boolean conversion
    if (updates.isAvailable !== undefined) {
      updates.isAvailable = updates.isAvailable === 'true' || updates.isAvailable === true;
    }

    // Handle year conversion
    if (updates.year) {
      updates.year = parseInt(updates.year);
    }

    // Handle image update
    if (req.file) {
      updates.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true, runValidators: true }
    );
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({
      message: 'Car updated successfully',
      car: car
    });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(400).json({ message: 'Error updating car', error: error.message });
  }
});

// DELETE car
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// === CUSTOMER ROUTES ===

// GET all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CREATE new customer
app.post('/api/customers', upload.single('image'), async (req, res) => {
  try {
    const { name, email, phone, licenseNumber, isActive } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !licenseNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email already exists' });
    }

    const customerData = {
      name,
      email,
      phone,
      licenseNumber,
      isActive: isActive === 'true' || isActive === true
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
    
    res.status(201).json({
      message: 'Customer created successfully',
      customer: customer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(400).json({ message: 'Error creating customer', error: error.message });
  }
});

// UPDATE customer
app.put('/api/customers/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };

    // Handle boolean conversion
    if (updates.isActive !== undefined) {
      updates.isActive = updates.isActive === 'true' || updates.isActive === true;
    }

    if (req.file) {
      updates.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({
      message: 'Customer updated successfully',
      customer: customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(400).json({ message: 'Error updating customer', error: error.message });
  }
});

// DELETE customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// === RENTAL ROUTES ===

// GET all rentals with populated data
app.get('/api/rentals', async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('carId')
      .populate('customerId')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CREATE new rental
app.post('/api/rentals', async (req, res) => {
  try {
    const { carId, customerId, startDate, endDate, totalCost } = req.body;
    
    // Validate required fields
    if (!carId || !customerId || !startDate || !endDate || !totalCost) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if car is available
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (!car.isAvailable || car.isRented) {
      return res.status(400).json({ message: 'Car is not available for rental' });
    }

    // Check if customer exists and is active
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    if (!customer.isActive) {
      return res.status(400).json({ message: 'Customer is not active' });
    }

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

    res.status(201).json({
      message: 'Rental created successfully',
      rental: populatedRental
    });
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(400).json({ message: 'Error creating rental', error: error.message });
  }
});

// DELETE rental
app.delete('/api/rentals/:id', async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    // Update car and customer status
    await Car.findByIdAndUpdate(rental.carId, { isRented: false, isAvailable: true });
    await Customer.findByIdAndUpdate(rental.customerId, { hasRental: false });

    await Rental.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    console.error('Error deleting rental:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
});

// Multer error handling
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
  }
  next(error);
});

// 404 handler - FIXED: Use proper syntax
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected to Atlas' : 'Connecting...'}`);
});