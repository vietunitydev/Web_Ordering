import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';
import { UserProfile } from "../../shared/types.ts";

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load user data from server on mount
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:4999/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const fetchedUser: UserProfile = response.data.data;
                setUser(fetchedUser);
                setName(fetchedUser.name || '');
                setEmail(fetchedUser.email || '');
                setPhone(fetchedUser.phone || '');
                setAddress(fetchedUser.address || '');

                // Đồng bộ với localStorage (tùy chọn)
                // localStorage.setItem('user', JSON.stringify(fetchedUser));
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    // Handle form submission (save changes to server)
    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !phone || !address) {
            setError('Vui lòng nhập đầy đủ thông tin (Tên, Email, SĐT, Địa chỉ).');
            return;
        }

        if (!user) {
            setError('Không tìm thấy thông tin người dùng.');
            return;
        }

        const updatedUser: UserProfile = {
            ...user,
            name,
            email,
            phone,
            address,
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            await axios.put(
                'http://localhost:4999/api/users/update',
                updatedUser,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Cập nhật state và localStorage
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setError('');
            alert('Thông tin đã được cập nhật thành công!');
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
        }
    };

    // Handle delete account
    const handleDeleteAccount = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Gọi API để xóa tài khoản trên server (nếu có)
                await axios.delete('http://localhost:4999/api/users/delete', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Xóa dữ liệu local
                localStorage.removeItem('user');
                localStorage.removeItem('cart');
                localStorage.removeItem('token');
                navigate('/home');
            } catch (err) {
                console.error('Error deleting account:', err);
                setError('Không thể xóa tài khoản. Vui lòng thử lại.');
            }
        }
    };

    // Handle change password (placeholder)
    const handleChangePassword = () => {
        alert('Chức năng đổi mật khẩu đang được phát triển.');
    };

    if (loading) {
        return <div className="profile-page">Đang tải...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h2>Thông tin người dùng</h2>
                    <button className="delete-account-btn" onClick={handleDeleteAccount}>
                        Xóa tài khoản
                    </button>
                </div>
                <h3>Thay đổi thông tin</h3>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSaveChanges}>
                    <div className="form-group">
                        <label>Tên</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>SĐT</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input type="password" value="********" disabled />
                        <div className="change-password-wrapper">
                            <button
                                type="button"
                                className="change-password-link"
                                onClick={handleChangePassword}
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="save-btn">
                        Lưu thay đổi
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;