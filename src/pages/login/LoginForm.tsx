import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';
import {actions, useAppContext} from "../../components/AppContext/AppContext.tsx";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useAppContext();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ email và mật khẩu.');
            return;
        }

        setLoading(true);

        try {
            // Call the login API
            const response = await axios.post('http://localhost:4999/api/auth/login', {
                email,
                password,
            });

            if (response.data.success) {
                // Dispatch action LOGIN để cập nhật trạng thái người dùng trong context
                dispatch({ type: actions.LOGIN, payload: response.data.user });

                // Store token in local storage (nếu cần cho các request API sau này)
                localStorage.setItem('token', response.data.token);

                // Redirect to home page
                navigate('/home');
            } else {
                setError('Đăng nhập không thành công.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
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
                            type="email"
                            placeholder="Email"
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
                    <div className="options">
                        <label>
                            <input type="checkbox" /> Lưu thông tin đăng nhập
                        </label>
                        <Link to="/forgot-password">Quên mật khẩu?</Link>
                    </div>
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
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

// Axios is a popular HTTP Client library for JavaScript and Node.js. It helps you make HTTP requests (requests) to APIs or web services from your application.