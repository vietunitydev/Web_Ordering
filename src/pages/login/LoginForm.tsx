// LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
            return;
        }

        const validUsername = 'user@example.com';
        const validPassword = 'password123';

        if (username === validUsername && password === validPassword) {
            setError('');
            localStorage.setItem('user', JSON.stringify({ username }));
            navigate('/home'); // Redirect to Home (FoodPage)
        } else {
            setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Đăng Nhập</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Tên đăng nhập hoặc Email"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                    <div className="options">
                        <label>
                            <input type="checkbox" /> Lưu thông tin đăng nhập
                        </label>
                        <a href="#" className="forgot-password">
                            Quên mật khẩu?
                        </a>
                    </div>
                    <button type="submit" className="login-button">
                        Đăng Nhập
                    </button>
                    <p className="policy-text">
                        Bằng cách đăng nhập hoặc đăng ký, bạn đồng ý với{' '}
                        <a href="#">Chính sách của EATNOW</a>.
                    </p>
                    <p>
                        Chưa có tài khoản? <Link to="/register">Đăng Ký</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;