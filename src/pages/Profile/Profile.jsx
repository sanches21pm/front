import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Получение профиля при загрузке компонента
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('https://sanches.pythonanywhere.com/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setEmail(response.data.email);
      } catch (error) {
        setMessage('Не удалось загрузить профиль.');
      }
    };

    fetchProfile();
  }, []);

  // Обновление только email
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
          'https://sanches.pythonanywhere.com/profile',
          { email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      setMessage('Email успешно обновлён!');
    } catch (error) {
      setMessage('Ошибка обновления email.');
    }
  };

  // Удаление аккаунта
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete('https://sanches.pythonanywhere.com/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('access_token');
      setMessage('Аккаунт успешно удалён!');
      setTimeout(() => navigate('/'), 1500); // Переход на главную страницу через 1.5 секунды
    } catch (error) {
      setMessage('Ошибка при удалении аккаунта.');
    }
  };

  return (
      <div className="profile-container">
        <h2>Профиль пользователя</h2>
        {profile ? (
            <form onSubmit={handleUpdateEmail}>
              <div className="form-group">
                <label htmlFor="username">Имя пользователя:</label>
                <input type="text" id="username" value={profile.username} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Роль:</label>
                <input type="text" id="role" value={profile.role} disabled />
              </div>
              <button type="submit">Обновить Email</button>
              <button type="button" className="delete-account-button" onClick={handleDeleteAccount}>
                Удалить аккаунт
              </button>
            </form>
        ) : (
            <p>Загрузка...</p>
        )}
        {message && <p>{message}</p>}
      </div>
  );
};

export default Profile;
