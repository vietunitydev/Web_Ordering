import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './AdminUsersPage.css';

interface User {
    username: string;
    email: string;
    avatar?: string;
    _id?: string; // Thêm nếu server trả về ID
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
            if (!token) {
                setError('Không có token. Vui lòng đăng nhập lại.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:4999/api/users/all', { // Đường dẫn API
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                const formattedUsers: User[] = data.users.map((user: any) => ({
                    _id: user._id, // Lưu ID nếu server trả về
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar || '', // Giả sử avatar có thể null
                }));

                setUsers(formattedUsers);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (email: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Không có token. Vui lòng đăng nhập lại.');
                return;
            }

            try {
                // Gọi API để xóa người dùng trên server
                await fetch(`http://localhost:4999/api/users/${email}`, { // Giả sử endpoint xóa theo email
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Cập nhật state sau khi xóa
                const updatedUsers = users.filter((user) => user.email !== email);
                setUsers(updatedUsers);
                setError(null);
            } catch (err) {
                console.error('Error deleting user:', err);
                setError('Không thể xóa người dùng. Vui lòng thử lại.');
            }
        }
    };

    if (loading) {
        return (
            <AdminLayout activePage="users">
                <div className="admin-users-page">Đang tải...</div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout activePage="users">
                <div className="admin-users-page">
                    <p className="error-message">{error}</p>
                </div>
            </AdminLayout>
        );
    }

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
                            <tr key={user._id || user.email}> {/* Sử dụng _id nếu có, nếu không dùng email */}
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