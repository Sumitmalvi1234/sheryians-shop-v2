const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 0
  },
  imageUrl: {
    type: String,
    default: 'https://placeholder.com'
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
