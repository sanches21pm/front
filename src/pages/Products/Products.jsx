import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('https://sanches.pythonanywhere.com/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsSeller(response.data.role === 'seller');
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('https://sanches.pythonanywhere.com/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
      <div className="products-container">
        <div className="products-grid">
          {isSeller && (
              <div className="product-card add-product-card" onClick={handleAddProduct}>
                <FaPlusCircle className="add-product-icon" />
                <h3 className="add-product-text">Добавить продукт</h3>
              </div>
          )}
          {products.map((product) => (
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
              </div>
          ))}
        </div>
      </div>
  );
};

export default Products;
