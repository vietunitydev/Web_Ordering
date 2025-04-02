import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './AdminUsersPage.css';

interface User {
    username: string;
    email: string;
    avatar?: string;
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            // Nếu chưa có, tạo dữ liệu mẫu
            const sampleUsers = [
                { username: 'user1', email: 'user1@example.com', avatar: 'https://via.placeholder.com/30' },
                { username: 'user2', email: 'user2@example.com' },
            ];
            setUsers(sampleUsers);
            localStorage.setItem('users', JSON.stringify(sampleUsers));
        }
    }, []);

    const handleDelete = (email: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            const updatedUsers = users.filter((user) => user.email !== email);
            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
        }
    };

    return (
        <AdminLayout activePage="users">
            <div className="admin-users-page">
                <h2>Users Management</h2>
                {users.length === 0 ? (
                    <p className="no-users">Chưa có người dùng nào.</p>
                ) : (
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.email}>
                                <td>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} className="user-avatar" />
                                    ) : (
                                        'No Avatar'
                                    )}
                                </td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(user.email)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminUsersPage;