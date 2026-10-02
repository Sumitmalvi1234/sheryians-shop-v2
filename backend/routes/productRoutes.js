const express = require('express');
const router = express.Router();

// 📝 Updated: Added 'updateProduct' to the imported controller array list below
const { getProducts, createProduct, deleteProduct, updateProduct } = require('../controllers/productController');

// Import the protect middleware
const { protect } = require('../middleware/authMiddleware');

// Leave GET public (anybody can view products), inject protect into POST for security
router.route('/')
  .get(getProducts)
  .post(protect, createProduct); 

// Inject protect into both PUT (update) and DELETE endpoints so only authorized requests pass
router.route('/:id')
  .put(protect, updateProduct) // 📝 Registered the secure update handler route
  .delete(protect, deleteProduct);

module.exports = router;
