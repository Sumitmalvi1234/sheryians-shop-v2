import React, { useState, useEffect } from 'react';
import API from '../api/client';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add / Update Product
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
          setProducts(
            products.map((item) =>
              item._id === editId ? res.data.data : item
            )
          );
        } else {
          setProducts([...products, res.data.data]);
        }

        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          stock: '',
          imageUrl: ''
        });

        setIsEditing(false);
        setEditId(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to save product.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit Product
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

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Cancel Edit
  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);

    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      imageUrl: ''
    });
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this product listing?'
      )
    ) {
      try {
        const res = await API.delete(`/products/${id}`);

        if (res.data.success) {
          setProducts(
            products.filter((item) => item._id !== id)
          );

          setCart(
            cart.filter((item) => item._id !== id)
          );
        }
      } catch (err) {
        alert('Failed to delete the product.');
      }
    }
  };

  // Add To Cart
  const addToCart = (product) => {
    const exist = cart.find(
      (item) => item._id === product._id
    );

    if (exist) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...exist, qty: exist.qty + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          qty: 1
        }
      ]);
    }
  };

  // Remove From Cart
  const removeFromCart = (product) => {
    const exist = cart.find(
      (item) => item._id === product._id
    );

    if (exist.qty === 1) {
      setCart(
        cart.filter(
          (item) => item._id !== product._id
        )
      );
    } else {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? {
                ...exist,
                qty: exist.qty - 1
              }
            : item
        )
      );
    }
  };

  // Cart Total
  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.qty,
    0
  );

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'sans-serif',
        color: '#fff'
      }}
    >

      {/* FORM SECTION */}

      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto 40px auto',
          padding: '20px',
          border: '1px solid #333',
          borderRadius: '8px',
          backgroundColor: '#1a1a1a'
        }}
      >

        <h3>
          {isEditing
            ? '✏️ Edit Product'
            : '📦 Add New Product Listing'}
        </h3>

        {error && (
          <div
            style={{
              color: '#ff6b6b',
              marginBottom: '15px'
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}
        >

          {/* Product Name */}

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '5px'
              }}
            >
              Product Title
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#2a2a2a',
                color: '#fff'
              }}
            />
          </div>

          {/* Category */}

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '5px'
              }}
            >
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#2a2a2a',
                color: '#fff'
              }}
            />
          </div>

          {/* Price */}

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '5px'
              }}
            >
              Price ($)
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#2a2a2a',
                color: '#fff'
              }}
            />
          </div>

          {/* Stock */}

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '5px'
              }}
            >
              Available Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#2a2a2a',
                color: '#fff'
              }}
            />
          </div>

          {/* Image URL */}

          <div style={{ gridColumn: 'span 2' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px'
              }}
            >
              Product Image URL
            </label>

            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#2a2a2a',
                color: '#fff'
              }}
            />
          </div>

          {/* Description */}

          <div style={{ gridColumn: 'span 2' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px'
              }}
            >
              Description Details
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#2a2a2a',
                color: '#fff',
                resize: 'none'
              }}
            />
          </div>

          {/* Save / Update */}

          <button
            type="submit"
            disabled={loading}
            style={{
              gridColumn: 'span 2',
              padding: '10px',
              backgroundColor: '#646cff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {loading
              ? 'Saving...'
              : isEditing
              ? 'Update Product'
              : 'Save Product into Catalog'}
          </button>

          {/* Cancel */}

          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                gridColumn: 'span 2',
                padding: '8px',
                backgroundColor: '#555',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel Edit
            </button>
          )}

        </form>
      </div>


      {/* TWO COLUMN LAYOUT */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr',
          gap: '30px',
          maxWidth: '1300px',
          margin: '0 auto'
        }}
      >

        {/* PRODUCT CATALOG */}

        <div>

          <h3 style={{ marginBottom: '20px' }}>
            🛒 Current Store Catalog ({products.length} Items)
          </h3>

          {products.length === 0 ? (
            <p style={{ color: '#aaa' }}>
              No products found. Add some above!
            </p>
          ) : (

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '20px'
              }}
            >

              {products.map((item) => (

                <div
                  key={item._id}
                  style={{
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: '#1a1a1a',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >

                  <div>

                    {/* Product Image */}

                    <img
                      src={
                        item.imageUrl ||
                        'https://placehold.co/300x200'
                      }
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '140px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginBottom: '10px'
                      }}
                    />

                    <h4
                      style={{
                        margin: '0 0 5px 0',
                        color: '#646cff'
                      }}
                    >
                      {item.name}
                    </h4>

                    <span
                      style={{
                        fontSize: '12px',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#2a2a2a',
                        color: '#aaa'
                      }}
                    >
                      {item.category}
                    </span>

                    <p
                      style={{
                        fontSize: '13px',
                        color: '#ccc',
                        margin: '10px 0',
                        minHeight: '40px'
                      }}
                    >
                      {item.description}
                    </p>

                  </div>


                  <div>

                    {/* Price and Stock */}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '10px',
                        borderTop: '1px solid #2a2a2a',
                        paddingTop: '10px',
                        marginBottom: '10px'
                      }}
                    >

                      <span
                        style={{
                          fontWeight: 'bold',
                          fontSize: '18px',
                          color: '#44ff44'
                        }}
                      >
                        ${item.price}
                      </span>

                      <span
                        style={{
                          fontSize: '12px',
                          color: '#aaa'
                        }}
                      >
                        Stock: {item.stock}
                      </span>

                    </div>


                    {/* Add To Cart */}

                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        marginBottom: '8px'
                      }}
                    >
                      ➕ Add To Cart
                    </button>


                    {/* Edit */}

                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        width: '100%',
                        padding: '6px',
                        backgroundColor: '#ff9900',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '8px'
                      }}
                    >
                      ✏️ Edit Product
                    </button>


                    {/* Delete */}

                    <button
                      onClick={() =>
                        handleDelete(item._id)
                      }
                      style={{
                        width: '100%',
                        padding: '6px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        opacity: 0.8
                      }}
                    >
                      🗑️ Delete Listing
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* SHOPPING CART */}

        <div
          style={{
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#1a1a1a',
            height: 'fit-content'
          }}
        >

          <h3
            style={{
              margin: '0 0 20px 0',
              borderBottom: '1px solid #333',
              paddingBottom: '10px'
            }}
          >
            🛍️ Your Basket
          </h3>


          {cart.length === 0 ? (

            <p
              style={{
                color: '#aaa',
                textAlign: 'center',
                fontSize: '14px'
              }}
            >
              Your shopping basket is completely empty.
            </p>

          ) : (

            <div>

              {cart.map((basketItem) => (

                <div
                  key={basketItem._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px',
                    borderBottom: '1px solid #2a2a2a',
                    paddingBottom: '10px'
                  }}
                >

                  <div style={{ maxWidth: '60%' }}>

                    <h5
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '14px',
                        color: '#646cff'
                      }}
                    >
                      {basketItem.name}
                    </h5>

                    <span
                      style={{
                        fontSize: '12px',
                        color: '#44ff44'
                      }}
                    >
                      ${basketItem.price} × {basketItem.qty}
                    </span>

                  </div>


                  <div
                    style={{
                      display: 'flex',
                      gap: '5px'
                    }}
                  >

                    <button
                      onClick={() =>
                        removeFromCart(basketItem)
                      }
                      style={{
                        padding: '2px 8px',
                        backgroundColor: '#555',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      -
                    </button>

                    <button
                      onClick={() =>
                        addToCart(basketItem)
                      }
                      style={{
                        padding: '2px 8px',
                        backgroundColor: '#555',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      +
                    </button>

                  </div>

                </div>

              ))}


              {/* TOTAL */}

              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '15px',
                  borderTop: '2px dashed #333',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >

                <span style={{ fontWeight: 'bold' }}>
                  Total Bill:
                </span>

                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#44ff44'
                  }}
                >
                  ${cartTotal.toFixed(2)}
                </span>

              </div>


              {/* CHECKOUT */}

              <button
                onClick={() => {
                  alert('Order placed successfully!');
                  setCart([]);
                }}
                style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '10px',
                  backgroundColor: '#ff9900',
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                💳 Proceed to Checkout
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;