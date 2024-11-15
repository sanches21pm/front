import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  // Fetch user profile to check if the user is a seller or admin
  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('https://sanches.pythonanywhere.com/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('https://sanches.pythonanywhere.com/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
      setFilteredProducts(response.data); // Initially display all products
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for the filter dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://sanches.pythonanywhere.com/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  // Apply filter when the selected category changes
  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(product => product.category_id === parseInt(selectedCategory)));
    } else {
      setFilteredProducts(products); // Show all products when no category is selected
    }
  }, [selectedCategory, products]);

  // Initial data fetch
  useEffect(() => {
    fetchProfile();
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`https://sanches.pythonanywhere.com/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter(product => product.id !== productId));
      setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
      <div className="products-container">
        {/* Category Filter */}
        <div className="category-filter">
          <label htmlFor="category-select">Фильтр по категории: </label>
          <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
            ))}
          </select>
        </div>

        <div className="products-grid">
          {(userRole === 'seller' || userRole === 'admin') && (
              <div className="product-card add-product-card" onClick={handleAddProduct}>
                <FaPlusCircle className="add-product-icon" />
                <h3 className="add-product-text">Добавить продукт</h3>
              </div>
          )}
          {filteredProducts.map((product) => (
              <div
                  className="product-card"
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
              >
                {product.image_url && (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-image"
                    />
                )}
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <p className="product-description">{product.description}</p>
                {(userRole === 'seller' || userRole === 'admin') && (
                    <div className="product-actions">
                      <button onClick={() => handleEditProduct(product.id)} className="edit-button">
                        <FaEdit /> Изменить
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }} className="delete-button">
                        <FaTrash /> Удалить
                      </button>
                    </div>
                )}
              </div>
          ))}
        </div>
      </div>
  );
};

export default Products;
