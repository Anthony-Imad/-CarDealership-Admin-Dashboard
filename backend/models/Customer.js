const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    phone: {
        type: Number,
        required: true,
        unique: true
    },

    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },

    isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

//
customerSchema.index({email: 1, isActive: 1});  

customerSchema.methods.getActiveRentals = function() {
    return mongoose.model('Rental').find({
        customer: this._id,
        status: {$in: ['reserved', 'active']}
    });
};

module.exports = mongoose.model('Customer', customerSchema);
