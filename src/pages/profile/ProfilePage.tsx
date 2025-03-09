// ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<{ username: string; gender?: string; email?: string } | null>(null);
    const [name, setName] = useState('');
    const [gender, setGender] = useState('Nam');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Load user data from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setName(parsedUser.username || 'Viet');
            setGender(parsedUser.gender || 'Nam');
            setEmail(parsedUser.email || 'doarviet@gmail.com');
        } else {
            navigate('/login'); // Redirect to login if no user is found
        }
    }, [navigate]);

    // Handle form submission (save changes)
    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        const updatedUser = { username: name, gender, email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setError('');
        alert('Thông tin đã được cập nhật thành công!');
    };

    // Handle delete account
    const handleDeleteAccount = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
            localStorage.removeItem('user');
            localStorage.removeItem('cart'); // Optional: clear cart on account deletion
            navigate('/home');
        }
    };

    // Handle change password (placeholder)
    const handleChangePassword = () => {
        alert('Chức năng đổi mật khẩu đang được phát triển.');
    };

    if (!user) {
        return null; // Render nothing while redirecting
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
                        <label>Giới tính</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
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
                        <label>Mật khẩu</label>
                        <input type="password" value="********" disabled />
                        <button
                            type="button"
                            className="change-password-link"
                            onClick={handleChangePassword}
                        >
                            Đổi mật khẩu
                        </button>
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