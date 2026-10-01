const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct } = require('../controllers/productController');

// 📝 Step 1: Import the protect middleware
const { protect } = require('../middleware/authMiddleware');

// 📝 Step 2: Leave GET public (so anybody can view products), but inject protect into POST
router.route('/')
  .get(getProducts)
  .post(protect, createProduct); 

// 📝 Step 3: Inject protect into DELETE so only logged-in users can delete items
router.route('/:id')
  .delete(protect, deleteProduct);

module.exports = router;
