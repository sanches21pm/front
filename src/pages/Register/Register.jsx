import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Установим по умолчанию 'user'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://sanches.pythonanywhere.com/register', {
        username,
        email,
        password,
        role, // Отправляем роль
      });
      setMessage('Регистрация прошла успешно!');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      setMessage('Не удалось зарегистрироваться. Попробуйте снова.');
    }
  };

  return (
      <div className="register-container">
        <h2>Регистрация</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
          />
          <input
              type="email"
              placeholder="Электронная почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
          >
            <option value="user">Пользователь</option>
            <option value="seller">Продавец</option>
          </select>
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
  );
};

export default Register;
