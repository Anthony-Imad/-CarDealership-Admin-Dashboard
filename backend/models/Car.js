const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    
    make: { 
    type: String, 
    required: true 
  },

  model: { 
    type: String, 
    required: true 
  },

  year: { 
    type: Number, 
    required: true,
    min: 1950 
  },

  licensePlate: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true 
  },

  dailyRate: { 
    type: Number, 
    required: true,
    min: 0 
  },

  isAvailable: { 
    type: Boolean, 
    default: true 
  },

  features: [{ 
    type: String 
  }]
  
}, {
  timestamps: true
});

// Compound index for search optimization
carSchema.index({ make: 1, model: 1, isAvailable: 1 });

// Method to check availability
carSchema.methods.isCarAvailable = async function(startDate, endDate) {
  const conflictingRental = await mongoose.model('Rental').findOne({
    car: this._id,
    status: { $in: ['reserved', 'active'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  });
  
  return !conflictingRental;
};

module.exports = mongoose.model('Car', carSchema);

