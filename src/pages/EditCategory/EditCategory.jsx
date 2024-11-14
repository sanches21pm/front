import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditCategory.css';

const EditCategory = () => {
    const { category_id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Функция для получения списка категорий и поиска нужной по ID
    const fetchCategoryDetails = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.get('https://sanches.pythonanywhere.com/categories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const category = response.data.find(cat => cat.id === parseInt(category_id));
            if (category) {
                setName(category.name);
                setDescription(category.description);
            } else {
                setMessage('Категория не найдена');
            }
        } catch (error) {
            setMessage('Не удалось загрузить категорию.');
            console.error('Ошибка при загрузке категорий:', error);
        }
    };

    useEffect(() => {
        fetchCategoryDetails();
    }, [category_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            await axios.put(
                `https://sanches.pythonanywhere.com/categories/${category_id}`,
                { name, description },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMessage('Категория успешно обновлена!');
            setTimeout(() => navigate('/categories'), 1500);
        } catch (error) {
            setMessage('Не удалось обновить категорию.');
            console.error('Ошибка при обновлении категории:', error);
        }
    };

    return (
        <div className="edit-category-container">
            <h2>Изменить категорию</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Название категории"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Описание категории"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit">Обновить категорию</button>
            </form>
        </div>
    );
};

export default EditCategory;
