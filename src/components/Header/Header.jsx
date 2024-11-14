import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      fetchProfile(token);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get('https://sanches.pythonanywhere.com/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Не удалось получить данные профиля:', error);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setProfile(null);
    navigate('/');
  };

  return (
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <FaUser className="user-icon" />
            {isAuthenticated && profile ? (
                <span className="profile-name">Привет, {profile.username}!</span>
            ) : (
                <Link to="/login" className="profile-link">Вход</Link>
            )}
          </div>
          <nav>
            <Link to="/" className="nav-button">Главная</Link>
            <Link to="/about-us" className="nav-button">О нас</Link> {/* New About Us link */}
            <Link to="/categories" className="nav-button">Категории</Link>
            <Link to="/products" className="nav-button">Продукты</Link>
            {isAuthenticated ? (
                <>
                  <Link to="/profile" className="nav-button">Профиль</Link>
                  <button className="nav-button" onClick={handleLogout}>Выйти</button>
                </>
            ) : (
                <>
                  <Link to="/register" className="nav-button">Регистрация</Link>
                </>
            )}
          </nav>
        </div>
      </header>
  );
};

export default Header;
