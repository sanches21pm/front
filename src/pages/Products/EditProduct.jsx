import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';

const EditProduct = () => {
    const { product_id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://sanches.pythonanywhere.com/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        }
    };

    const fetchProductDetails = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.get(`https://sanches.pythonanywhere.com/products/${product_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const product = response.data;
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setSelectedCategory(product.category_id);
        } catch (error) {
            console.error('Ошибка загрузки данных продукта:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProductDetails();
    }, [product_id]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', parseFloat(price));
        formData.append('category_id', selectedCategory);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.put(
                `https://sanches.pythonanywhere.com/products/${product_id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setMessage('Продукт успешно обновлен!');
            setTimeout(() => navigate('/products'), 1500);
        } catch (error) {
            console.error('Ошибка при обновлении продукта:', error);
            setMessage('Не удалось обновить продукт. Попробуйте снова.');
        }
    };

    return (
        <div className="edit-product-container">
            <h2>Редактировать продукт</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Название продукта"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Описание продукта"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Цена продукта"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                />
                <button type="submit">Обновить продукт</button>
            </form>
        </div>
    );
};

export default EditProduct;
