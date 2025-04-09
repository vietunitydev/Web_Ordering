import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './AdminUsersPage.css';
import { User } from "../../shared/types.ts";

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
                    _id: user._id.toString(), // Chuyển ObjectId thành string
                    email: user.email,
                    name: user.name, // Sử dụng 'name' thay vì 'username'
                    phone: user.phone || '', // Giả sử có trường phone
                    address: user.address || '', // Giả sử có trường address
                    role: user.role || 'user', // Giả sử có trường role
                    avatar: user.avatar || '', // Giả sử có trường avatar
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

    const handleDelete = async (userId: string) => { // Sử dụng _id thay vì email để xóa
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Không có token. Vui lòng đăng nhập lại.');
                return;
            }

            try {
                // Gọi API để xóa người dùng trên server (sử dụng _id thay vì email)
                await fetch(`http://localhost:4999/api/users/${userId}`, { // Endpoint xóa theo _id
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Cập nhật state sau khi xóa
                const updatedUsers = users.filter((user) => user._id !== userId);
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
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>

                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || 'N/A'}</td>
                                <td>{user.address || 'N/A'}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(user._id)}
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