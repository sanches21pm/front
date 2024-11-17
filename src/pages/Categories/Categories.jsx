import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Получаем данные профиля, чтобы определить, является ли пользователь администратором
  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('https://sanches.pythonanywhere.com/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsAdmin(response.data.role === 'admin');
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
    }
  };

  // Загружаем категории
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://sanches.pythonanywhere.com/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    navigate('/add-category');
  };

  const handleEditCategory = (categoryId) => {
    navigate(`/edit-category/${categoryId}`);
  };

  // Функция удаления категории и всех продуктов в ней
  const handleDeleteCategory = async (categoryId) => {
    const token = localStorage.getItem('access_token');
    try {
      // Получаем все продукты в категории, чтобы удалить их
      const productsResponse = await axios.get(`https://sanches.pythonanywhere.com/categories/${categoryId}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const products = productsResponse.data;

      // Удаляем каждый продукт отдельно
      for (const product of products) {
        await axios.delete(`https://sanches.pythonanywhere.com/products/${product.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Удаляем категорию
      await axios.delete(`https://sanches.pythonanywhere.com/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Обновляем список категорий
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error('Ошибка при удалении категории:', error);
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
      <div className="categories-container">
        <h2>Categories</h2>
        <div className="categories-grid">
          {(isAdmin) && (
              <div className="category-card add-category-card" onClick={handleAddCategory}>
                <FaPlusCircle className="add-category-icon" />
                <h3 className="add-category-text">Добавить категорию</h3>
              </div>
          )}
          {categories.map((category) => (
              <div className="category-card" key={category.id}>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                {isAdmin && (
                    <div className="category-actions">
                      <button onClick={() => handleEditCategory(category.id)} className="edit-button">
                        <FaEdit /> Изменить
                      </button>
                      <button onClick={() => handleDeleteCategory(category.id)} className="delete-button">
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

export default Categories;
