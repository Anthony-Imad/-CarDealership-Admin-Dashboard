const mongoose = require('mongoose');

const rentalSchema = new mongoose.schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },

    startDate: { 
        type: Date, 
        required: true 
    },
    
    endDate: { 
        type: Date, 
        required: true 
    },
    
    totalAmount: { 
        type: Number, 
        required: true,
        min: 0 
    },
    
  status: { 
    type: String, 
    enum: ['reserved', 'active', 'completed', 'cancelled'],
    default: 'reserved'
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
rentalSchema.index({ customer: 1, status: 1 });
rentalSchema.index({ car: 1, status: 1 });
rentalSchema.index({ startDate: 1, endDate: 1 });

// Pre-save middleware to validate rental dates
rentalSchema.pre('save', async function(next) {
  if (this.isModified('startDate') || this.isModified('endDate') || this.isNew) {
    if (this.startDate >= this.endDate) {
      return next(new Error('End date must be after start date'));
    }
    
    // Check if car is available for the selected dates
    const conflictingRental = await mongoose.model('Rental').findOne({
      car: this.car,
      _id: { $ne: this._id }, // Exclude current rental when updating
      status: { $in: ['reserved', 'active'] },
      $or: [
        { startDate: { $lte: this.endDate }, endDate: { $gte: this.startDate } }
      ]
    });
    
    if (conflictingRental) {
      return next(new Error('Car is already booked for the selected dates'));
    }
  }
  next();
});

module.exports = mongoose.model('Rental', rentalSchema);