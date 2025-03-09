// RegisterForm.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterForm.css';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    // Simulate saving user data (in a real app, this would be an API call)
    const userData = { username, email, password };
    localStorage.setItem('user', JSON.stringify(userData));

    setError('');
    // Redirect to NavBar page
    navigate('/home');
  };

  return (
      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">Đăng Ký</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <input
                  type="text"
                  placeholder="Tên người dùng"
                  className="input-field"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                  type="text"
                  placeholder="Tên đăng nhập hoặc Email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="input-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="register-button">
              Đăng Ký
            </button>
            <p className="policy-text">
              Bằng cách đăng nhập hoặc đăng ký, bạn đồng ý với{' '}
              <a href="#">Chính sách của EATNOW</a>.
            </p>
            <p>
              Đã có tài khoản? <Link to="/">Đăng Nhập</Link>
            </p>
          </form>
        </div>
      </div>
  );
};

export default RegisterForm;