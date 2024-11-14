import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://sanches.pythonanywhere.com/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

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
            await axios.post(
                'https://sanches.pythonanywhere.com/products',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setMessage('Продукт успешно добавлен!');
            setTimeout(() => navigate('/products'), 1500);
        } catch (error) {
            console.error('Ошибка при добавлении продукта:', error);
            setMessage('Не удалось добавить продукт. Попробуйте снова.');
        }
    };

    return (
        <div className="add-product-container">
            <h2>Добавить продукт</h2>
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
                <button type="submit">Добавить продукт</button>
            </form>
        </div>
    );
};

export default AddProduct;
