import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const carSchema = new mongoose.Schema({
    make: {type: String, required: true},
    model: {type: String, required: true},
    year: {type: String, required: true},
    licenseplate: {type: String, required: true, unique: true},
    isAvailable: {type: Boolean, default: true},
    image: {
        data: Buffer,
        contentType: String,
        filename: String
    },
    isRented: {type: Boolean, default: false}, //dot indicator if it was rented
    createdAt: {type: Date, default: Date.now}
});

const customerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    licenseeumber: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    image: {
        data: Buffer,
        contentType: String,
        filename: String
    },
    hasRental: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now}
});

//rental schema to link cars and customers
const rentalSchema = new mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    totalCost: {type: Number, required: true},
    status: {
        type: String,
        enum: ['active', 'completed', cancelled],
        default: 'active'
    },
    createdAt: {type: Date, default: Date.now}
});

export const Car = mongoose.model('Car', carSchema);
export const Customer = mongoose.model('Customer', customerSchema);
export const Rental = mongoose.model('Rental', rentalSchema);


