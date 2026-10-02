import React, { useState, useEffect } from 'react';
import API from '../api/client';

// 📝 Step 1: Accept the role parameter prop from App.jsx
const Dashboard = ({ role }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      setError('Could not load inventory items.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = isEditing
        ? await API.put(`/products/${editId}`, formData)
        : await API.post('/products', formData);

      if (res.data.success) {
        if (isEditing) {
          setProducts(products.map((item) => item._id === editId ? res.data.data : item));
        } else {
          setProducts([...products, res.data.data]);
        }

        setFormData({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
        setIsEditing(false);
        setEditId(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product listing?')) {
      try {
        const res = await API.delete(`/products/${id}`);
        if (res.data.success) {
          setProducts(products.filter((item) => item._id !== id));
          setCart(cart.filter((item) => item._id !== id));
        }
      } catch (err) {
        alert('Failed to delete the product.');
      }
    }
  };

  const addToCart = (product) => {
    const exist = cart.find((item) => item._id === product._id);
    if (exist) {
      setCart(cart.map((item) => item._id === product._id ? { ...exist, qty: exist.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    const exist = cart.find((item) => item._id === product._id);
    if (exist.qty === 1) {
      setCart(cart.filter((item) => item._id !== product._id));
    } else {
      setCart(cart.map((item) => item._id === product._id ? { ...exist, qty: exist.qty - 1 } : item));
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  return (
    
    <div style={{ padding: '15px', fontFamily: 'sans-serif', color: '#fff', maxWidth: '1300px', margin: '0 auto' }}>
      
      {/* 📦 CONDITIONAL ADMIN FORM SECTION */}
      {role === 'admin' && (
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto 40px auto', padding: '20px', border: '1px solid #333', borderRadius: '12px', backgroundColor: '#1a1a1a', boxSizing: 'border-box' }}>
          <h3>{isEditing ? '✏️ Edit Product' : '📦 Add New Product Listing'}</h3>
          {error && <div style={{ color: '#ff6b6b', marginBottom: '15px' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Product Title</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Price (Rs)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Available Stock</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Product Image URL</label>
              <input type="url" name="imageUrl" placeholder="https://example.com" value={formData.imageUrl} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Description Details</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff', resize: 'none', boxSizing: 'border-box' }}></textarea>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '10px', backgroundColor: isEditing ? '#ff9900' : '#646cff', color: isEditing ? '#000' : '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                {loading ? 'Processing...' : isEditing ? 'Update Product Details' : 'Save Product into Catalog'}
              </button>
              {isEditing && (
                <button type="button" onClick={cancelEdit} style={{ flex: 1, padding: '10px', backgroundColor: '#555', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* 🔎 SEARCH BAR INTERFACE ROW */}
      <div style={{ width: '100%', marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
        <input type="text" placeholder="🔍 Search products by title or category..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', maxWidth: '500px', padding: '12px 20px', borderRadius: '25px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* --- RESPONSIVE GRID LAYOUT --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* PRODUCT GRID CATALOG */}
        <div style={{ width: '100%' }}>
          <h3 style={{ marginBottom: '20px' }}>🛒 Store Catalog ({filteredProducts.length} Items)</h3>
          {filteredProducts.length === 0 ? (
            <p style={{ color: '#aaa' }}>No products found matching parameters.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {filteredProducts.map((item) => (
                <div key={item._id} style={{ border: '1px solid #333', borderRadius: '10px', padding: '15px', backgroundColor: '#1a1a1a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                  <div>
                    <img src={item.imageUrl || 'https://placeholder.com'} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 5px 0', color: '#646cff' }}>{item.name}</h4>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', backgroundColor: '#2a2a2a', color: '#aaa', display: 'inline-block' }}>{item.category}</span>
                    <p style={{ fontSize: '13px', color: '#ccc', margin: '10px 0', minHeight: '35px' }}>{item.description}</p>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid #2a2a2a', paddingTop: '10px', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#44ff44' }}>Rs.{item.price}</span>
                      <span style={{ fontSize: '12px', color: '#aaa' }}>Stock: {item.stock}</span>
                    </div>
                    
                    <button onClick={() => addToCart(item)} style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
                      ➕ Add To Cart
                    </button>
                    
                    {/* 🔑 CONDITIONAL ADMINISTRATIVE CONTROLS */}
                    {role === 'admin' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(item)} style={{ flex: 1, padding: '8px', backgroundColor: '#ff9900', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(item._id)} style={{ flex: 1, padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SHOPPING CART BASKET PANEL */}
        <div style={{ width: '100%', border: '1px solid #333', borderRadius: '10px', padding: '20px', backgroundColor: '#1a1a1a', boxSizing: 'border-box' }}>
          <h3 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #333', paddingBottom: '10px' }}>🛍️ Your Basket</h3>
          
          {cart.length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center', fontSize: '14px' }}>Your shopping basket is completely empty.</p>
          ) : (
            <div>
              {cart.map((basketItem) => (
                <div key={basketItem._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #2a2a2a', paddingBottom: '10px' }}>
                  <div style={{ maxWidth: '60%' }}>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#646cff' }}>{basketItem.name}</h5>
                    <span style={{ fontSize: '12px', color: '#44ff44' }}>Rs{basketItem.price} × {basketItem.qty}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => removeFromCart(basketItem)} style={{ padding: '4px 10px', backgroundColor: '#555', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                    <button onClick={() => addToCart(basketItem)} style={{ padding: '4px 10px', backgroundColor: '#555', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px dashed #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>Total Bill:</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#44ff44' }}>Rs{cartTotal.toFixed(2)}</span>
              </div>
<button onClick={() => { alert('Order simulation executed successfully!'); setCart([]); }} style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#ff9900', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>                🛒 Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
