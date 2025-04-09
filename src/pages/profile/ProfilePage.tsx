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
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
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
                localStorage.setItem('user', JSON.stringify(fetchedUser));
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

    // Handle form submission (save profile changes)
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

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setError('');
            alert('Thông tin đã được cập nhật thành công!');
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
        }
    };

    // Handle password change
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Vui lòng nhập đầy đủ mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.put(
                'http://localhost:4999/api/auth/change-password',
                {
                    currentPassword,
                    newPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
            setShowPasswordForm(false); // Ẩn form sau khi đổi thành công
            alert('Mật khẩu đã được thay đổi thành công!');

            localStorage.setItem('token', response.data.token);
        } catch (err: any) {
            console.error('Error changing password:', err);
            setPasswordError(err.response?.data?.message || 'Không thể thay đổi mật khẩu. Vui lòng thử lại.');
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

                await axios.delete('http://localhost:4999/api/users/delete', {
                    headers: { Authorization: `Bearer ${token}` },
                });

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

    // Toggle password form visibility
    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
        setPasswordError(''); // Reset lỗi khi mở/đóng form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
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

                {/* Chỉ hiển thị form thông tin cá nhân khi không hiển thị form đổi mật khẩu */}
                {!showPasswordForm && (
                    <>
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
                                        onClick={togglePasswordForm}
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="save-btn">
                                Lưu thay đổi
                            </button>
                        </form>
                    </>
                )}

                {/* Form đổi mật khẩu (hiển thị khi nhấn nút) */}
                {showPasswordForm && (
                    <div className="password-form">
                        <h3>Đổi mật khẩu</h3>
                        {passwordError && <p className="error-message">{passwordError}</p>}
                        <form onSubmit={handleChangePassword}>
                            <div className="form-group">
                                <label>Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="save-btn">
                                Xác nhận đổi mật khẩu
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={togglePasswordForm}
                            >
                                Hủy
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;